from aiogram import types, html
from aiogram.filters import Command, StateFilter
from aiogram.fsm.context import FSMContext
from aiohttp import ClientSession

from .utils import FsmData

from .utils.keyboards import markup
from .utils.states import ScrollingStates
from ..bot import dp

markup_list = ["Next", "❌"]

@dp.message(Command(commands=["scrolling", "scroll", "posts"]))
async def scrolling_post(message: types.Message, state: FSMContext):
    fsm_data: FsmData = await state.get_data()
    
    if fsm_data.get("api_key"):
        await message.answer(
            "Here we go! Please, press \"Next\".", 
            reply_markup=markup(markup_list)
        )
        await state.set_state(ScrollingStates.scrolling)
    else:
        await message.answer("First: register.\n/auth")

@dp.message(StateFilter(ScrollingStates.scrolling))
async def scrolling_states_scrolling(message: types.Message, state: FSMContext):
    if message.text in markup_list:
        if message.text == markup_list[0]:
            fsm_data: FsmData = await state.get_data()
            if fsm_data.get("api_key"):
                print("Here")
                async with ClientSession("http://localhost:4300") as cl:
                    async with cl.get(f"/tg/{fsm_data.get('api_key')}/posts?group={fsm_data.get('current_group')}") as response:
                        if response.status == 200:
                            data = (await response.json())["subdata"]
                            print(data)
                            
                            message_text = [
                                f"Title: {html.bold(data['title'])}",
                                f"{html.link('Link', data['url'])}: {data['url']}",
                                f"Rank: {html.italic(data['rank'])}",
                                f"Discrod tag: {html.italic(data['discord_tag'])}",
                                f"Telegram: {html.italic(data['telegram_tag'])}",
                            ]

                            await message.answer("\n".join(message_text))
                        else:
                            await message.answer("Something wrong to loading your groups")
            else:
                await message.answer("First: register.\n/auth")
        else:
            await state.set_state(None)
            await message.answer("❌ Cancel posts scrolling is successful")
    else:
        await message.answer("Hey, incorrect answer.")