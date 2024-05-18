from uuid import UUID
from fastapi import Path

from api_loader import *
from src.models.post import PostMakeRequest
from base_loader import *

from src.db.utils import get_scalar_by_uuid
from src.db.auth import UserTable, ProfileImageTable
from src.db.post import PostTable, PostPropsTable, PostImagesTable

from src.models.base_models import Subdated
from src.models.group import GroupMakeRequest


router = APIRouter(prefix="/post")
subrouter = APIRouter(prefix="/single")

@subrouter.get("/{post_id}", status_code=status.HTTP_200_OK)
async def get_post(
    post_id: str = Path(..., title="Post ID"), 
    session: AsyncSession = Depends(db.get_session)
):
    post: PostTable = (await get_scalar_by_uuid(post_id, session, PostTable))
    
    if post:
        return JSONResponse(
            Subdated(
                subdata={
                    **post.to_dict(), 
                    "post_props": post.post_props.to_dict(),
                    "post_images": post.post_props.to_dict()
                }
            ).model_dump()
        )
    else:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail="Post is not found"
        )

router.include_router(subrouter)
@router.post("/new", status_code=status.HTTP_201_CREATED)
async def new_post(
    request: Request,
    body: PostMakeRequest,
    session: AsyncSession = Depends(db.get_session)
):
    access = jwtsecure.access_required(request)
    if access:
        model_dict = body.model_dump(exclude={"postProps", "postImages"})
        post = PostTable(
            **model_dict,
            author_id=access["payload"]["id"]
        )

        session.add(post)
        await session.commit()
        await session.refresh(post)

        post_props = PostPropsTable(**body.postProps.model_dump(), post_id=post.id)
        images = {k: b64decode(v.split(",")[1].encode()) for k, v in body.postImages.model_dump().items() if v}

        post_images = PostImagesTable(**images, post_id=post.id)

        session.add_all([post_props, post_images])
        await session.commit()

        return JSONResponse(
            Subdated(
                subdata={
                    "group_id": str(post.group_id),
                    "post_id": str(post.id)
                }
            ).model_dump(),
            status_code=status.HTTP_201_CREATED
        )
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")