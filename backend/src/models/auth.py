from base_loader import *
from .base_models import *

class SignUpRequest(BaseRequestModel):
    first_name: str
    last_name: str
    birth: str
    username: str
    password: str
    email: str

class SignInRequest(BaseRequestModel):
    username: str
    password: str

class AuthResponse(BaseResponseModel):
    class Subdata(BaseModel):
        uuid: str

    subdata: Union[Subdata, Dict]