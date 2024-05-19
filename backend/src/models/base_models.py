from fastapi import Query
from src.db.utils import FilterTypes
from base_loader import Optional, Union
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

class Subdated(BaseResponseModel):
    subdata: dict | list

class Paged(BaseModel):
    f: Optional[str] = Query(None, title="Filter value/s")
    ft: str = Query(FilterTypes.new.name, title="Filter type")
    page: int = Query(1, title="Page")
    activeType: str = Query("all", title="Active type(Only for posts)") 
    isMine: bool = Query(False)

__all__ = [
    "BaseAdditionalsModel", "BaseRequestModel", 
    "BaseResponseModel", "BaseModel", "Subdated", "Paged"
]