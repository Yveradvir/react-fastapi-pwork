from aiogram import types, F
from aiogram.filters import Command, StateFilter
from aiogram.fsm.context import FSMContext
from aiohttp import ClientSession

from .utils import FsmData

from .utils.keyboards import markup, default_markup_text
from .utils.states import SelectingStates
from ..bot import dp

group_markup = lambda fsm_data: markup([
    group if group != fsm_data.get("current_group") else "[✨] "+group
    for group in fsm_data.get("profile").get("groups")
] + ["❌"])

@dp.message(Command(commands=["select", "group"]))
async def select_group(message: types.Message, state: FSMContext):
    fsm_data: FsmData = await state.get_data()
    
    if fsm_data.get("api_key"):
        if fsm_data.get("select_count") >= 3:
            async with ClientSession("http://localhost:4300") as cl:
                async with cl.get(f"/tg/{fsm_data.get('api_key')}/groups") as response:
                    if response.status == 200:
                        data = fsm_data.copy()
                        
                        data["profile"]["groups"] = (await response.json())["subdata"]
                        data["select_count"] = 0

                        await state.set_data(data)
                    else:
                        await message.answer("Something wrong to loading your groups")
        
        await state.update_data({"select_count": fsm_data["select_count"]+1})
        fsm_data: FsmData = await state.get_data()

        await state.set_state(SelectingStates.selecting)
        await message.answer(
            "Here we go! Please, select a group whose posts you want to see when you will serfing posts.", 
            reply_markup=group_markup(fsm_data)
        )
    else:
        await message.answer("First: register.\n/auth")

@dp.message(StateFilter(SelectingStates.selecting))
async def selecting_states_selecting(message: types.Message, state: FSMContext):
    fsm_data: FsmData = await state.get_data()
    
    if fsm_data.get("api_key"):
        if message.text == "❌":
            await state.set_state(None)
            await message.answer("❌ Cancel group selecting is successful")
        else:
            new_group = message.text.split("[✨]")[-1] if message.text.startswith("[✨] ") else message.text

            if new_group in fsm_data.get("profile").get("groups"):
                data = fsm_data.copy()
                data["current_group"] = new_group

                await state.set_data(data)
                await message.answer("Your group right now is "+new_group, reply_markup=group_markup((await state.get_data())))
            else:
                await message.answer("Incorect group name, try again or press on ❌")
    else:
        await message.answer("First: register.\n/auth")
