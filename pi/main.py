import sys
import os
from dotenv import load_dotenv

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

if __name__ == "__main__":
    dataGenerator._sendData()
