from api_loader import *
from src.models.base_models import Subdated
from base_loader import *

from src.db.auth import UserTable, ProfileImageTable
from src.models.auth import AuthResponse, SignInRequest, SignUpRequest, BaseAdditionalsModel

router = APIRouter(prefix="/auth")

@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    request: Request, body: SignUpRequest,
    session: AsyncSession = Depends(db.get_session)
) -> JSONResponse:
    existing_user = (await session.execute(
        select(UserTable).where(UserTable.username == body.username)
    )).scalar_one_or_none()
    is_email_taken = (await session.execute(
        select(UserTable).where(UserTable.email == body.email)
    )).scalar_one_or_none()

    if not existing_user:
        if not is_email_taken:
            body.password = password.hash(body.password)
            body.birth = datetime.strptime(body.birth, "%Y-%m-%dT%H:%M:%S.%fZ")
            
            _user_body = body.model_dump()
            _user_body.pop("profile_image")

            print(_user_body)
            new_user = UserTable(**_user_body) 

            session.add(new_user)
            await session.commit()

            uid = str(new_user.id)
            
            if body.profile_image:
                await ProfileImageTable.add_new(b64=body.profile_image, uid=uid)

            access, access_csrf = jwtsecure.create_access_token(data={"id": uid})
            refresh, refresh_csrf = jwtsecure.create_refresh_token(data={"id": uid})

            response = JSONResponse(
                AuthResponse(
                    subdata=AuthResponse.Subdata(
                        uuid=uid
                    ),
                    additionals=BaseAdditionalsModel(
                        loadUserProfile=True
                    )
                ).model_dump(), status.HTTP_201_CREATED
            )
            
            jwtsecure.set_access_cookie(response, str(access))
            jwtsecure.set_refresh_cookie(response, str(refresh))

            return response
        else:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already exists"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already exists"
        )

@router.post("/signin", response_model=AuthResponse, status_code=status.HTTP_200_OK)
async def signin(
    request: Request, body: SignInRequest, 
    session: AsyncSession = Depends(db.get_session)
) -> JSONResponse:
    user = (await session.execute(
        select(UserTable).where(UserTable.username == body.username)
    )).scalar_one_or_none()

    if user:
        uid = str(user.id)
        if password.verify(body.password, user.password):
            access, access_csrf = jwtsecure.create_access_token(data={"id": uid})
            refresh, refresh_csrf = jwtsecure.create_refresh_token(data={"id": uid})

            response = JSONResponse(
                AuthResponse(
                    subdata=AuthResponse.Subdata(
                        uuid=uid
                    ),
                    additionals=BaseAdditionalsModel(
                        loadUserProfile=True
                    )
                ).model_dump(), status.HTTP_200_OK
            )
            
            jwtsecure.set_access_cookie(response, str(access))
            jwtsecure.set_refresh_cookie(response, str(refresh))

            return response
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Passwords don't match"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User doesn't exists"
        )
    
@router.post("/refresh", status_code=status.HTTP_200_OK)
async def refresh(
    request: Request
):
    access = jwtsecure.refresh_required(request)

    new, new_csrf = jwtsecure.create_access_token(data={"id": access["payload"]["id"]})
    
    response = JSONResponse(
        Subdated(
            subdata={
                "access": new
            }
        ).model_dump(), status.HTTP_200_OK
    )

    jwtsecure.set_access_cookie(response, new)

    return response