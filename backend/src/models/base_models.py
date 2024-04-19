from base_loader import Dict
from pydantic import BaseModel

class BaseAdditionalsModel(BaseModel):
    pass

class BaseRequestModel(BaseModel):
    pass

class BaseResponseModel(BaseModel):
    ok: bool
    subdata: Dict
    additionals: BaseAdditionalsModel

__all__ = [
    "BaseAdditionalsModel", "BaseRequestModel", 
    "BaseResponseModel", "BaseModel"
]