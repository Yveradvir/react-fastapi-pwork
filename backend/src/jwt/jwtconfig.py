from base_loader import *
from pydantic import BaseModel

class JwtConfig(BaseModel):
    algorithm: str = "HS256"  
    secret_key: str

    access_cookie_name: str = "access"
    access_csrf_cookie_name: str = "access_csrf"
    access_max_age: Union[int, timedelta] = timedelta(minutes=40).seconds

    refresh_cookie_name: str = "refresh"
    refresh_csrf_cookie_name: str = "refresh_csrf"
    refresh_max_age: Union[int, timedelta] = timedelta(hours=2).seconds
    
    csrf_header_name: str = "X-CSRF-Token"
    trigger_time: Union[int, timedelta] = timedelta(minutes=30).seconds

    samesite: Union[str, None] = None
    secure: bool = False
