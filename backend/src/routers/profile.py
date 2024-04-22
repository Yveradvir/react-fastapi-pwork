from api_loader import *
from base_loader import *

from src.db.auth import UserTable
from src.models.profile import ProfileModel

router = APIRouter(prefix="/profile")

@router.get("/my", response_model=ProfileModel, status_code=status.HTTP_200_OK)
async def get_my_profile(
    request: Request, session: AsyncSession = Depends(db.get_session)
): 
    token = jwtsecure.access_required(request)

    if token:
        user = (await session.execute(
            select(UserTable).where(UserTable.id == token["payload"]["id"])
        )).scalar_one_or_none()

        if user:
            user = user.to_dict()
            user.pop("password")

            return JSONResponse(
                ProfileModel(
                    subdata=user
                ).model_dump(), status_code=status.HTTP_200_OK
            )