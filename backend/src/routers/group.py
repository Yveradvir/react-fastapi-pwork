from fastapi import Path, Query
from sqlalchemy import Select

from api_loader import *
from base_loader import *

from src.db.utils import AccessEnum, FilterTypes, filtrating, get_scalar_by_uuid
from src.db.auth import UserTable, ProfileImageTable
from src.db.post import GroupTable, GroupUserMemberships, PostTable

from src.models.base_models import Paged, Subdated
from src.models.group import GroupMakeRequest


router = APIRouter(prefix="/group")
subrouter = APIRouter(prefix="/single")

@subrouter.get("/{group_id}", status_code=status.HTTP_200_OK)
async def get_group(
    request: Request,
    group_id: str = Path(..., title="Group ID"), 
    session: AsyncSession = Depends(db.get_session)
):
    access = jwtsecure.access_required(request)
    group = (await get_scalar_by_uuid(group_id, session, GroupTable))
    memberships = (await session.execute(
        select(GroupUserMemberships).where(
            GroupUserMemberships.user_id == access["payload"]["id"]
        ).where(
            GroupUserMemberships.group_id == group.id
        )
    )).scalar_one_or_none()

    if group:
        return JSONResponse(
            Subdated(
                subdata={
                        "group": group.to_dict(),
                        "relation": {
                            "memberships": memberships.to_dict(),
                            "totalCount": len((await session.execute(select(PostTable).where(PostTable.group_id == group_id))).scalars().all())
                        }
                    }
            ).model_dump()
        )
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
    if paged.isMine:
        access = jwtsecure.access_required()
    offset = (paged.page - 1) * PAGINATION_UNIT

    base_query = select(PostTable).where(PostTable.group_id == group_id)
    if paged.isMine: 
        base_query = base_query.where(PostTable.id == access["payload"]["id"])
    base_query: Select[Tuple[PostTable]] = await filtrating(
        paged.f, paged.ft, base_query, PostTable
    )


    paginated_query = base_query.offset(offset).limit(PAGINATION_UNIT)

    posts = await session.execute(paginated_query)
    posts = posts.scalars().all()

    posts_data = [{**post.to_dict(), **post.post_props.to_dict(), "main":post.post_images.get_main()} for post in posts]

    return JSONResponse(Subdated(subdata=posts_data.model_dump()))

router.include_router(subrouter)
@router.post("/new", status_code=status.HTTP_201_CREATED)
async def new_post(
    request: Request, body: GroupMakeRequest,
    session: AsyncSession = Depends(db.get_session)
):
    access = jwtsecure.access_required(request)

    if access:
        uid = access["payload"]["id"]
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
