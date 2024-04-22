from base_loader import Dict, Union
from pydantic import BaseModel

class BaseAdditionalsModel(BaseModel):
    loadUserProfile: bool = False

class BaseRequestModel(BaseModel):
    pass

class BaseResponseModel(BaseModel):
    class Subdata(BaseModel):
        pass

    ok: bool = True
    subdata: Union[Subdata, dict]
    additionals: BaseAdditionalsModel = BaseAdditionalsModel()


__all__ = [
    "BaseAdditionalsModel", "BaseRequestModel", 
    "BaseResponseModel", "BaseModel"
]