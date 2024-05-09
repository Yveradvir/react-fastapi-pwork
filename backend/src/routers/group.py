from uuid import UUID
from fastapi import Path

from api_loader import *
from base_loader import *

from src.db.utils import get_scalar_by_uuid
from src.db.auth import UserTable, ProfileImageTable
from src.db.post import GroupTable

from src.models.base_models import Subdated
from src.models.group import GroupMakeRequest


router = APIRouter(prefix="/group")
subrouter = APIRouter(prefix="/single")

@subrouter.get("/{group_id}", status_code=status.HTTP_200_OK)
async def get_post(
    group_id: str = Path(..., title="Group ID"), 
    session: AsyncSession = Depends(db.get_session)
):
    group = (await get_scalar_by_uuid(group_id, session, GroupTable))
    
    if group:
        return JSONResponse(
            Subdated(
                subdata=group.to_dict()
            )
        )
    else:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail="Group is not found"
        )

router.include_router(subrouter)
@router.post("/new", status_code=status.HTTP_201_CREATED)
async def new_post(
    request: Request, body: GroupMakeRequest,
    session: AsyncSession = Depends(db.get_session)
):
    access = jwtsecure.access_required(request)

    if access:

        return JSONResponse(
            Subdated(
                subdata={
                    "result": "DSdas"
                }
            ).model_dump()
        )