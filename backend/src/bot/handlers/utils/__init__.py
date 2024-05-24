from typing import TypedDict, List, Union
from aiogram.types import BotCommand

from . import keyboards
from . import states

commands = [
    BotCommand(command="/start", description="Command to start this bot"),
    BotCommand(command="/auth", description="Command to register in this bot"),
    BotCommand(command="/select", description="Command to select a current group for looking for posts"),
    BotCommand(command="/scrolling", description="Command to scrolling posts"),
]

class FsmData(TypedDict):
    class Profile(TypedDict):
        username: str
        groups: List[str]

    api_key: str
    profile: Profile
    current_group: Union[None, str]
    select_count: int