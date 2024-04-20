from base_loader import Dict
from pydantic import BaseModel

class BaseAdditionalsModel(BaseModel):
    loadUserProfile: bool = False

class BaseRequestModel(BaseModel):
    pass

class BaseResponseModel(BaseModel):
    ok: bool = True
    subdata: Dict
    additionals: BaseAdditionalsModel = BaseAdditionalsModel()

__all__ = [
    "BaseAdditionalsModel", "BaseRequestModel", 
    "BaseResponseModel", "BaseModel"
]