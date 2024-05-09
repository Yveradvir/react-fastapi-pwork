from uuid import UUID
from fastapi import Path, Query

from api_loader import *
from base_loader import *

from src.db.utils import FilterTypes, get_scalar_by_uuid
from src.db.auth import UserTable, ProfileImageTable
from src.db.post import GroupTable, PostTable

from src.models.base_models import Subdated
from src.models.group import GroupMakeRequest


router = APIRouter(prefix="/group")
subrouter = APIRouter(prefix="/single")

@subrouter.get("/{group_id}", status_code=status.HTTP_200_OK)
async def get_group(
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

@subrouter.get("/{group_id}/posts", status_code=status.HTTP_200_OK)
async def get_group_posts(
    group_id: str = Path(..., title="Group ID"), 
    f: str = Query(None, title="Filter value/s"), 
    ft: str = Query(FilterTypes.new.value, title="Filter type"),
    page: int = Query(1, title="Page"),
    session: AsyncSession = Depends(db.get_session)
):
    offset = (page - 1) * PAGINATION_UNIT

    base_query = select(PostTable).where(PostTable.group_id == group_id)

    if f:
        if ft == FilterTypes.title.value:
            base_query = base_query.where(PostTable.title.ilike(f))
        elif ft == FilterTypes.new.value:
            base_query = base_query.order_by(PostTable.created_at.desc())
        elif ft == FilterTypes.old.value:
            base_query = base_query.order_by(PostTable.created_at.asc())

    paginated_query = base_query.offset(offset).limit(PAGINATION_UNIT)

    posts = await session.execute(paginated_query)
    posts = posts.scalars().all()

    if not posts:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No posts found for the given group ID"
        )

    posts_data = [post.to_dict() for post in posts]

    return JSONResponse(Subdated(subdata=posts_data))

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