# /msgbot/bot_main.py
import importlib
import pkgutil
from msgbot import Bots

# Bots 디렉토리의 모든 모듈 import (자동 로드)
loaded_modules = []
for _, modname, _ in pkgutil.iter_modules(Bots.__path__):
    module = importlib.import_module(f"msgbot.Bots.{modname}")
    loaded_modules.append(module)
    print(f"[bot_main] 모듈 로드됨: {modname}")

def handle_command(chat):
    """
    명령을 직접 분배하지 않음.
    단지 모든 bot 모듈의 handle_message()를 호출.
    """
    for module in loaded_modules:
        if hasattr(module, "handle_message"):
            module.handle_message(chat)
