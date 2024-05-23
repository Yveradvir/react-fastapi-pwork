from api_loader import db, password
from config import _g

from aiogram import Bot, Dispatcher
from aiogram.fsm.storage.memory import MemoryStorage

storage = MemoryStorage()
bot = Bot(token=_g("bot_token"), parse_mode='HTML')
dp = Dispatcher(storage=storage)
