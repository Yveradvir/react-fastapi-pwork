from api_loader import *
from base_loader import *

from src.db.auth import UserTable
from src.models.base_models import BaseResponseModel

router = APIRouter(prefix="/profile")

@router.get("/my", response_model=BaseResponseModel, status_code=status.HTTP_200_OK)
async def get_my_profile(
    request: Request, session: AsyncSession = Depends(db.get_session)
): 
    pass