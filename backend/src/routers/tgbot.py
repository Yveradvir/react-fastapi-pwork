from random import randint
from fastapi import Path, Query
from api_loader import *
from base_loader import *
from src.db.utils import get_scalar_by_uuid
from src.models.base_models import Subdated
from sqlalchemy.orm import selectinload


from src.db.auth import UserTable
from src.db.post import GroupTable, GroupUserMemberships, PostTable

from src.models.auth import PasswordsRequest

router = APIRouter(prefix="/tg")
api_key = lambda uid: f"$[{uid}]::{token_urlsafe(16)};{''.join(password.encrypt(token_urlsafe(8)+str(uuid4())).split('/'))}"

async def get_titles(uid: str, session: AsyncSession) -> list[str]:
    membersips = (await session.execute(
        select(GroupUserMemberships)
            .where(GroupUserMemberships.user_id == uid)
            .options(selectinload(GroupUserMemberships.group))
    )).scalars().all()

    return [mc.group.title for mc in membersips]


@router.post("/{api_token}/match")
async def match_api_token(
    request: Request, body: PasswordsRequest,
    api_token: str = Path(..., title="Api Key(Token)"), 
    session: AsyncSession = Depends(db.get_session)
):
    tokenpart = api_token.split("]")[0][2:]
    user = (await get_scalar_by_uuid(
        tokenpart, session
    ))

    if user:
        if user.api_key.split(";")[0] == api_token:
            if password.verify(body.password, user.password):
                new_key = api_key(user.id)
                user.api_key = new_key
                await session.commit()

                return JSONResponse(
                    Subdated(
                        subdata={
                            "api_key":new_key,
                            "username": user.username, 
                        }
                    ).model_dump()
                )
            else:
                raise HTTPException(status.HTTP_403_FORBIDDEN, "Forbiden. Incorrect password.")
        else:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Forbiden. Incorrect token.")
    else: 
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User is not exists")
    
@router.get("/{api_token}/data")
async def api_token(
    request: Request, api_token: str = Path(..., title="Api Key(Token)"), 
    session: AsyncSession = Depends(db.get_session)
):
    user = (await session.execute(
        select(UserTable).where(UserTable.api_key == api_token)
    )).scalar_one_or_none()

    if user:
        return JSONResponse(
            Subdated(
                subdata={
                    "api_key": user.api_key,
                    "profile": {
                        "username": user.username,
                        "groups": (await get_titles(user.id, session)),
                    },
                    "current_group": None,
                    "select_count": 1
                }
            ).model_dump()
        )
    else:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User is not exists. Maybe you enter incorect api key")
    
@router.get("/{api_token}/posts")
async def api_token(
    request: Request, api_token: str = Path(..., title="Api Key(Token)"), 
    group: str = Query(..., title="Group title"),
    session: AsyncSession = Depends(db.get_session)
):
    _group = (await session.execute(select(GroupTable).where(GroupTable.title == group))).scalar_one_or_none()

    if _group:
        posts = (await session.execute(
            select(PostTable)
                .where(PostTable.group_id == _group.id)
                .options(selectinload(PostTable.post_props))
        )).scalars().all()
        print(posts)
        post = posts[randint(0, len(posts)-1)]

        return JSONResponse(
            Subdated(
                subdata={
                    **post.post_props.to_dict(),
                    "title": post.title,
                    "url": f"http://localhost:4200/group/{str(_group.id)}/{str(post.id)}"
                }
            ).model_dump()
        )
    else:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Group is not exists")