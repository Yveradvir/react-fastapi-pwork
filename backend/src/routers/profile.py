from uuid import UUID
from fastapi import Path

from api_loader import *
from backend.src.db.post import GroupTable
from base_loader import *

from src.db.utils import get_user_by_uuid
from src.db.auth import UserTable, ProfileImageTable
from src.models.base_models import Subdated


router = APIRouter(prefix="/profile")
subrouter = APIRouter(prefix="/single")

@subrouter.get("/{user_id}", response_model=Subdated, status_code=status.HTTP_200_OK)
async def get_profile(
    user_id: str = Path(..., title="User ID"), 
    session: AsyncSession = Depends(db.get_session)
):
    user = (await get_user_by_uuid(user_id, session))

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
    user = (await get_user_by_uuid(user_id, session))

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

@subrouter.get("/{user_id}/groups", response_model=Subdated, status_code=status.HTTP_200_OK)
async def get_profile_groups(
    user_id: str = Path(..., title="User ID"), 
    session: AsyncSession = Depends(db.get_session)
):
    user = (await get_user_by_uuid(user_id, session))

    if user:
        groups = (await session.execute(
            select(GroupTable).where(GroupTable.author_id == user.id)
        )).all()

        return JSONResponse(
            Subdated(
                subdata=[
                    {"title": group.title, "uuid": str(group.id)} 
                    for group in groups
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