from ..bot import dp
from aiogram.filters import CommandStart
from aiogram import types

@dp.message(CommandStart())
async def start(message: types.Message):
    await message.answer("Hello! This is a bot for Findmaty. Here you can find new friends and teammates for any games you want. \n First: you should've been registered at the Findmaty \n Second: just click at it -> /auth")