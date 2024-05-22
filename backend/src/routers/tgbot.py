from fastapi import Path
from api_loader import *
from base_loader import *
from src.db.utils import get_scalar_by_uuid
from src.models.base_models import Subdated

from src.db.auth import UserTable
from src.models.auth import PasswordsRequest

router = APIRouter(prefix="/tg")

@router.post("/{api_token}/match")
async def match_api_token(
    request: Request, body: PasswordsRequest,
    api_token: str = Path(..., title="Api Token"), 
    session: AsyncSession = Depends(db.get_session)
):
    user = (await get_scalar_by_uuid())