from aiogram import types, F
from aiogram.filters import Command, StateFilter
from aiogram.fsm.context import FSMContext
from aiohttp import ClientSession
import re

from .utils.keyboards import markup, default_markup_text
from .utils.states import AuthStates
from ..bot import dp

@dp.message(Command(commands=["auth", "signin", "login"]))
async def start(message: types.Message, state: FSMContext):
    await message.answer("Please, enter your API key!", reply_markup=markup(["Cancel"]))
    await state.set_state(AuthStates.api_key)

@dp.message(StateFilter(AuthStates.api_key))
async def auth_states_api_key(message: types.Message, state: FSMContext):
    pattern = re.compile(r'^\$\[[0-9a-fA-F-]{36}\]::[^;]+$')
    msg = message.text

    if msg != "Cancel":
        if pattern.match(msg):
            await state.update_data({
                "api_key": msg
            })
            await state.set_state(AuthStates.password)
            await message.answer("Please send a password next.", reply_markup=markup(["Cancel"]))
        else:
            await message.answer("Invalid pattern, please send a valid API key.", reply_markup=markup(["Cancel"]))
    else:
        await message.answer("Registration is over!")
        await state.clear()

@dp.message(StateFilter(AuthStates.password))
async def auth_states_password(message: types.Message, state: FSMContext):
    fsm_data = await state.get_data()

    if message.text != "Cancel":
        async with ClientSession("http://localhost:4300") as cli:
            async with cli.post(f"/tg/{fsm_data['api_key']}/match", json={"password": message.text}) as response:
                if response.status == 200:
                    data = (await response.json())["subdata"]

                    await state.update_data({
                        'api_key': data["api_key"],
                        'username': data["username"]
                    })

                    await message.answer(f"So, do you confirm your own authentification? Is your username '{data['username']}'", reply_markup=markup())
                    await state.set_state(AuthStates.confirmation)
                else:
                    print(response)
                    reason = (await response.json())["detail"] or "Reason is not provided"
                    if "token." in reason.split():
                        await message.answer("Please, enter CORRECT api token", reply_markup=markup(["Cancel"]))
                        await state.set_state(AuthStates.api_key)
                    else:
                        await message.answer(f"Failed to authenticate with the provided API key.\nReason: {reason}", reply_markup=markup(["Cancel"]))
                    print(await response.text())
    else:
        await message.answer("Registration is over!")
        await state.clear()

@dp.message(StateFilter(AuthStates.confirmation))
async def auth_states_confirmation(message: types.Message, state: FSMContext):
    fsm_data = await state.get_data()

    if message.text in default_markup_text:
        if message.text == default_markup_text[0]:

            async with ClientSession("http://localhost:4300") as cli:
                async with cli.get(f"/tg/{fsm_data['api_key']}/data") as response:
                    if response.status == 200:
                        await message.answer(f"Good luck, {fsm_data['username']}\n\nBe extra carefull! Api keys are updating every time you sing in site")
                        data = (await response.json())["subdata"]
                        
                        await state.clear()
                        await state.set_data(data)
                    else:
                        await message.answer("Excuse us, something wrong... Try again or contradict.", reply_markup=markup())
        else:
            await message.answer("Thank for trying, you are not registered. ")
            await state.clear()
    else:
        await message.answer("Sorry, but you should've picked up one of provided blocks in your keyboard. Try again!", reply_markup=markup())