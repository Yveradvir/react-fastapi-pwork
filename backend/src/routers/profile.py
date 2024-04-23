from uuid import UUID
from fastapi import Path

from api_loader import *
from base_loader import *

from src.db.auth import UserTable
from src.models.profile import ProfileModel

router = APIRouter(prefix="/profile")

@router.get("/get/{user_id}", response_model=ProfileModel, status_code=status.HTTP_200_OK)
async def get_profile(
    user_id: str = Path(..., title="User ID"), 
    session: AsyncSession = Depends(db.get_session)
):
    try:
        print(user_id)
        user_uuid = UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID. Must be a valid UUID."
        )

    user = (await session.execute(
        select(UserTable).where(UserTable.id == user_uuid)
    )).scalar_one_or_none()

    if user:
        user = user.to_dict()
        user.pop("password")

        return JSONResponse(
            ProfileModel(
                subdata=user
            ).model_dump(), status_code=status.HTTP_200_OK
        )
    else:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

@router.get("/my", status_code=status.HTTP_307_TEMPORARY_REDIRECT)
async def get_my_profile(request: Request): 
    token = jwtsecure.access_required(request)

    if token:
        user_id = token["payload"]["id"]
        return RedirectResponse(url=f"/profile/get/{user_id}", status_code=status.HTTP_307_TEMPORARY_REDIRECT)
    
