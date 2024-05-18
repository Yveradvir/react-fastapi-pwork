from typing import Optional
from .base_models import *

class PostProps(BaseModel):
    rank: Optional[str] = None
    discord_tag: Optional[str] = None
    telegram_tag: Optional[str] = None

class PostImages(BaseModel):
    main: Optional[str] = None
    second: Optional[str] = None
    third: Optional[str] = None
    fourth: Optional[str] = None
    fifth: Optional[str] = None

class PostMakeRequest(BaseModel):
    title: str
    content: str
    group_id: str
    postImages: PostImages
    postProps: PostProps