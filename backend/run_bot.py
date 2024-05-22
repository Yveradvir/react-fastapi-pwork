import asyncio
import src.bot.handlers

from src.bot.bot import (
    dp, storage, bot, _g
)
    
async def main():
    try:
        await bot.send_message(_g("bot_admin"), "```Bot is working . . .```")
            
        # await dp.bot.set_my_commands(src.bot.handlers.commands)
        await dp.start_polling(bot)
    finally:
        await dp.storage.close()
        await bot.session.close()

if __name__ == '__main__':
    asyncio.run(main())