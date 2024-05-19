from fastapi import Path
from sqlalchemy.orm import selectinload

from api_loader import *
from src.models.post import PostMakeRequest
from base_loader import *

from src.db.utils import get_scalar_by_uuid
from src.db.post import PostTable, PostPropsTable, PostImagesTable

from src.models.base_models import Subdated


router = APIRouter(prefix="/post")
subrouter = APIRouter(prefix="/single")

@subrouter.get("/{post_id}", status_code=status.HTTP_200_OK)
async def get_post(
    request: Request,
    post_id: str = Path(..., title="Post ID"), 
    session: AsyncSession = Depends(db.get_session)
):
    access = jwtsecure.access_required(request)
    result = (await session.execute(
            select(PostTable).options(selectinload(PostTable.post_props), selectinload(PostTable.post_images)).filter(PostTable.id == post_id)
    ))
    post = result.scalars().first()

    if post:
        return JSONResponse(
            Subdated(
                subdata={
                    "post": {
                        **post.to_dict(),
                        "postProps": post.post_props.to_dict(),
                        "postImages": post.post_images.to_dict()
                    },
                    "am_author": str(post.author_id) == access["payload"]["id"]
                }
            ).model_dump(), status.HTTP_200_OK
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
    
