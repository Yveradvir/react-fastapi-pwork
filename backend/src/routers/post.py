from uuid import UUID
from fastapi import Path

from api_loader import *
from base_loader import *

from src.db.auth import UserTable, ProfileImageTable
from src.models.base_models import Subdated


router = APIRouter(prefix="/post")
subrouter = APIRouter(prefix="/single")

@router.post("/new", status_code=status.HTTP_201_CREATED)
async def new_post(
    request: Request, body: SignUpRequest,
    session: AsyncSession = Depends(db.get_session)
):