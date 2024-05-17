from typing import Optional
from .base_models import *

class PostMakeRequest(BaseRequestModel):
    class PostProsp(BaseModel):
        rank: Optional[str]

        discord_tag: Optional[str]
        telegram_tag: Optional[str]

    class PostImages(BaseModel):
        main: Optional[str]
        
        second: Optional[str]
        third: Optional[str]
        fourth: Optional[str]
        fifth: Optional[str]

    title: str
    content: str
    group_id: str

    post_images: PostImages
    post_props: PostProsp