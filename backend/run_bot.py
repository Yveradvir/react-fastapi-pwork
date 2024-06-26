import asyncio
import src.bot.handlers

from src.bot.handlers.utils import commands
from src.bot.bot import (
    dp, storage, bot, _g
)
    
async def main():
    await bot.set_my_commands(commands)
    await bot.send_message(_g("bot_admin"), "```Bot is working . . .```")
    
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        print("Bot stopped")