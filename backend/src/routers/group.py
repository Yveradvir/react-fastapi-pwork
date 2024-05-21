from fastapi import Path, Query
from sqlalchemy import Select, func, delete

from api_loader import *
from base_loader import *
from sqlalchemy.orm import joinedload

from src.db.utils import AccessEnum, FilterTypes, filtrating, get_scalar_by_uuid, max_memberships
from src.db.auth import UserTable, ProfileImageTable
from src.db.post import GroupTable, GroupUserMemberships, PostTable

from src.models.base_models import Paged, Subdated
from src.models.group import GroupMakeRequest


router = APIRouter(prefix="/group")
subrouter = APIRouter(prefix="/single")

@subrouter.post("/{group_id}/membership", status_code=status.HTTP_201_CREATED)
async def join(
    request: Request,
    group_id: str = Path(..., title="Group ID"), 
    session: AsyncSession = Depends(db.get_session)
):
    access = jwtsecure.access_required(request)
    uid = access["payload"]["id"]
    group = await get_scalar_by_uuid(group_id, session, GroupTable)
    await max_memberships(session, uid)
    is_exist = (await session.execute(
        select(GroupUserMemberships)
            .where(GroupUserMemberships.group_id == group_id)
            .where(GroupUserMemberships.user_id == uid)
    )).scalar_one_or_none()

    if not is_exist:
        membership = GroupUserMemberships(
            user_id=uid, group_id=group_id, access=0
        )

        session.add(membership)
        await session.commit()

        return JSONResponse(
            Subdated(
                subdata=membership.to_dict()
            ).model_dump(), status.HTTP_200_OK
        )
    else:
        raise HTTPException(
            status.HTTP_409_CONFLICT, "Memberships is arleady exist"
        )
    
@subrouter.delete("/{group_id}/membership", status_code=status.HTTP_200_OK)
async def leave(
    request: Request,
    group_id: str = Path(..., title="Group ID"), 
    session: AsyncSession = Depends(db.get_session)
):
    access = jwtsecure.access_required(request)
    uid = access["payload"]["id"]
    is_exist = (await session.execute(
        select(GroupUserMemberships)
            .where(GroupUserMemberships.group_id == group_id)
            .where(GroupUserMemberships.user_id == uid)
    )).scalar_one_or_none()

    if is_exist:
        await session.delete(is_exist)
        await session.commit()
        print(is_exist.to_dict())

        return JSONResponse(
            Subdated(subdata={}).model_dump(), status.HTTP_200_OK
        )
    else:
        raise HTTPException(
            status.HTTP_404, "Memberships is not exist"
        )

@subrouter.get("/{group_id}", status_code=status.HTTP_200_OK)
async def get_group(
    request: Request,
    group_id: str = Path(..., title="Group ID"), 
    session: AsyncSession = Depends(db.get_session)
):
    access = jwtsecure.access_required(request)
    group = await get_scalar_by_uuid(group_id, session, GroupTable)
    membership = (await session.execute(
        select(GroupUserMemberships).where(
            GroupUserMemberships.group_id == group_id
        ).where(
            GroupUserMemberships.user_id == access["payload"]["id"]
        )
    )).scalar_one_or_none()

    if group:
        posts_count = (
            await session.execute(
                select(func.count()).where(PostTable.group_id == group_id)
            )
        ).scalar_one_or_none()

        return JSONResponse(
            Subdated(
                subdata={
                    "group": group.to_dict(),
                    "relation": {
                        "membership": membership.to_dict() if membership else None,
                        "totalCount": posts_count or 0
                    }
                }
            ).model_dump()
        )
    else:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail="Group is not found"
        )

@subrouter.delete("/{group_id}", status_code=status.HTTP_200_OK)
async def delete_group(
    request: Request,
    group_id: str = Path(..., title="Group ID"), 
    session: AsyncSession = Depends(db.get_session)
):
    access = jwtsecure.access_required(request)
    group = await get_scalar_by_uuid(group_id, session, GroupTable)
    membership = (await session.execute(
        select(GroupUserMemberships).where(
            GroupUserMemberships.group_id == group_id
        ).where(
            GroupUserMemberships.user_id == access["payload"]["id"]
        )
    )).scalar_one_or_none()

    if group:
        if membership.access == 2:
            await session.execute(
                delete(GroupUserMemberships).where(
                    GroupUserMemberships.group_id == group.id
                )
            )
            await session.delete(group)
            await session.commit()

            return JSONResponse(
                Subdated(subdata={}).model_dump()
            )
        else:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not the author of the post")
    else:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail="Group is not found"
        )

@subrouter.get("/{group_id}/posts", status_code=status.HTTP_200_OK)
async def get_group_posts(
    group_id: str = Path(..., title="Group ID"), 
    paged: Paged = Depends(),
    session: AsyncSession = Depends(db.get_session)
):
    offset = (paged.page - 1) * PAGINATION_UNIT

    base_query = select(PostTable).where(
        PostTable.active == True if paged.active == "active" else False
    ) if paged.active != "all" else select(PostTable)
        
    base_query = ((await filtrating(paged.f, paged.ft, base_query, PostTable))
        .where(PostTable.group_id == group_id)
        .options(
            joinedload(PostTable.post_props),
            joinedload(PostTable.post_images)
        )
    )
    
    paginated_query = base_query.offset(offset).limit(PAGINATION_UNIT)
    result = await session.execute(paginated_query)
    posts = result.unique().scalars().all()  

    posts_data = [{
        **post.to_dict(),
        "post_props": post.post_props.to_dict(),
        "main": post.post_images.get_main()
    } for post in posts]

    return JSONResponse(Subdated(subdata=posts_data).model_dump())

router.include_router(subrouter)
@router.post("/new", status_code=status.HTTP_201_CREATED)
async def new_group(
    request: Request, body: GroupMakeRequest,
    session: AsyncSession = Depends(db.get_session)
):
    access = jwtsecure.access_required(request)

    if access:
        uid = access["payload"]["id"]
        await max_memberships(session, uid)

        group = GroupTable(
            **body.model_dump(),
            author_id=uid
        )

        session.add(group)
        await session.commit()

        memberships = GroupUserMemberships(
            user_id=uid, group_id=group.id, 
            access=AccessEnum.owner.value
        )

        session.add(memberships)
        await session.commit()

        return JSONResponse(
            Subdated(
                subdata={
                    "result": str(group.id)
                }
            ).model_dump()
        )
    
@router.get("/", status_code=status.HTTP_200_OK)
async def get_groups(
    request: Request,
    session: AsyncSession = Depends(db.get_session),
    paged: Paged = Depends()
):
    if paged.isMine:
        access = jwtsecure.access_required(request)

    offset = (paged.page - 1) * PAGINATION_UNIT

    base_query = select(GroupTable)
    if paged.isMine:
        memberships_query = select(GroupUserMemberships).where(
            GroupUserMemberships.user_id == access["payload"]["id"]
        )
        memberships = await session.execute(memberships_query)
        memberships = memberships.scalars().all()

        user_group_ids = {membership.group_id for membership in memberships}

        base_query = base_query.where(GroupTable.id.in_(user_group_ids))

    base_query: Select[Tuple[GroupTable]] = await filtrating(
        paged.f, paged.ft, base_query, GroupTable
    )

    paginated_query = base_query.offset(offset).limit(PAGINATION_UNIT)

    groups = await session.execute(paginated_query)
    groups = groups.scalars().all()

    groups_data = [group.to_dict() for group in groups]

    return JSONResponse(Subdated(subdata=groups_data).model_dump())

@router.get("/count", status_code=status.HTTP_200_OK)
async def get_count(
    session: AsyncSession = Depends(db.get_session)
):
    result = len((await session.execute(select(GroupTable))).scalars().all())
    return JSONResponse(Subdated(subdata={"result": result}).model_dump())
