from mqtt.dispatcher import Dispatcher
import sys
import os
from dotenv import load_dotenv
import time

load_dotenv()

dummy = ["--dummy" in sys.argv]

dataGenerator = None
if dummy:
    from dummyGenerator.data import DummyGenerator

    dataGenerator = DummyGenerator()
else:
    print("Currently only running dummy generator is supported")
    print("Use: python main.py --dummy")
    exit(1)

dispatcher = Dispatcher(dataGenerator)

if __name__ == "__main__":
    dispatcher.start_generator()
    time.sleep(10)
    dispatcher.stop_generator()
