from .utils.keyboards import markup
from ..bot import dp, client
from utils.states import AuthStates

from aiogram import F
from aiogram import types

from aiogram.filters import Command
from aiogram.fsm.context import FSMContext

import re

@dp.message(Command(commands=["auth", "signin", "login"]))
async def start(message: types.Message, state: FSMContext):
    await message.answer("Please, enter your api key!", reply_markup=markup(["Cancel"]))
    await state.set_state(AuthStates.api_key)

@dp.message(AuthStates.api_key)
async def auth_states_api_key(message: types.Message, state: FSMContext):
    pattern = r"^\$\[[0-9a-fA-F-]{36}\]::([^;]+);"

    if message.text != "Cancel":
        if re.compile(pattern, message.text):
            async with client as cli:
                async with cli.post(f"/tg/{message.text}") as response:
                    if response.status == 200:
                        data = response.json()
                    else:
                        print(data)
        else:
            await message.answer("Invalide pattern, please send copied api key")
    else:
        await message.answer("Cool!")
        await state.clear()