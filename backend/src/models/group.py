from .base_models import *

class GroupMakeRequest(BaseRequestModel):
    title: str
    content: str