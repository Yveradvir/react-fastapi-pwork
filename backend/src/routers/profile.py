from fastapi import Path

from sqlalchemy import delete
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError

from api_loader import *
from src.models.auth import PasswordsRequest
from src.db.post import GroupTable, GroupUserMemberships, PostImagesTable, PostPropsTable, PostTable
from base_loader import *

from src.db.utils import get_scalar_by_uuid
from src.db.auth import UserTable, ProfileImageTable
from src.models.base_models import Subdated


router = APIRouter(prefix="/profile")
subrouter = APIRouter(prefix="/single")

@subrouter.get("/{user_id}", response_model=Subdated, status_code=status.HTTP_200_OK)
async def get_profile(
    user_id: str = Path(..., title="User ID"), 
    session: AsyncSession = Depends(db.get_session)
):
    user = (await get_scalar_by_uuid(user_id, session))

    if user:
        user = user.to_dict()
        user.pop("password")

        return JSONResponse(
            Subdated(
                subdata=user
            ).model_dump(), status_code=status.HTTP_200_OK
        )
    else:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

@subrouter.get("/{user_id}/image", response_model=Subdated, status_code=status.HTTP_200_OK)
async def get_profile_image(
    user_id: str = Path(..., title="User ID"), 
    session: AsyncSession = Depends(db.get_session)
):
    user = (await get_scalar_by_uuid(user_id, session))

    if user:
        image = (await session.execute(
            select(ProfileImageTable).where(ProfileImageTable.user_id == user.id)
        )).scalar_one_or_none()

        result = None
        if image is not None:
            image = image.to_dict()
            result = image["first"] + image["image"]

        return JSONResponse(
            Subdated(
                subdata={
                    "result": result
                }
            ).model_dump()
        )
    else:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

@subrouter.delete("/{user_id}")
async def delete_account(
    body: PasswordsRequest,
    user_id: str = Path(..., title="User ID"),
    session: AsyncSession = Depends(db.get_session)
):
    user = await get_scalar_by_uuid(user_id, session, UserTable)

    if user:
        if password.verify(body.password, user.password):
            try:
                await session.execute(delete(GroupUserMemberships).where(GroupUserMemberships.user_id == user.id))
                await session.execute(delete(PostPropsTable).where(PostPropsTable.post_id.in_(
                    select(PostTable.id).where(PostTable.author_id == user.id)
                )))
                await session.execute(delete(PostImagesTable).where(PostImagesTable.post_id.in_(
                    select(PostTable.id).where(PostTable.author_id == user.id)
                )))
                await session.execute(delete(PostTable).where(PostTable.author_id == user.id))
                await session.execute(delete(GroupTable).where(GroupTable.author_id == user.id))

                await session.delete(user)
                await session.commit()

                response = JSONResponse(Subdated(subdata={}).model_dump())
                jwtsecure.dismantle(response)

                return response
            except IntegrityError as e:
                print(e)
                await session.rollback()
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete user due to database integrity error.")
        else:
            raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Passwords must match")
    else:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")

@subrouter.get("/{user_id}/groups", response_model=Subdated, status_code=status.HTTP_200_OK)
async def get_profile_groups(
    user_id: str = Path(..., title="User ID"), 
    session: AsyncSession = Depends(db.get_session)
):
    user = (await get_scalar_by_uuid(user_id, session))

    if user:
        memberships = (await session.execute(
            select(GroupUserMemberships)
                .where(GroupUserMemberships.user_id == user.id)
                .options(selectinload(GroupUserMemberships.group))
        )).scalars().all()

        return JSONResponse(
            Subdated(
                subdata=[
                    {"title": m.group.title, "uuid": str(m.group.id)} 
                    for m in memberships
                ]
            ).model_dump()
        )
    else:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )


router.include_router(subrouter)

@router.get("/my", status_code=status.HTTP_307_TEMPORARY_REDIRECT)
async def get_my_profile(request: Request): 
    token = jwtsecure.access_required(request)

    if token:
        user_id = token["payload"]["id"]
        
        return RedirectResponse(url=f"/profile/single/{user_id}", status_code=status.HTTP_307_TEMPORARY_REDIRECT)