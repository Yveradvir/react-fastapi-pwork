from uuid import UUID
from fastapi import Path

from api_loader import *
from base_loader import *

from src.db.utils import get_user_by_uuid
from src.db.auth import UserTable, ProfileImageTable
from src.db.post import PostTable, PostPropsTable, PostImagesTable

from src.models.base_models import Subdated
from src.models.post import PostMakeRequest


router = APIRouter(prefix="/post")
subrouter = APIRouter(prefix="/single")

@router.post("/new", status_code=status.HTTP_201_CREATED)
async def new_post(
    request: Request, body: PostMakeRequest,
    session: AsyncSession = Depends(db.get_session)
):
    return JSONResponse(
        Subdated(
            subdata={
                "result": "DSdas"
            }
        ).model_dump()
    )