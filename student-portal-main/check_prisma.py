import prisma
import os
import sys

print(f"Python executable: {sys.executable}")
print(f"Prisma file: {prisma.__file__}")
try:
    from prisma import Prisma
    print("Prisma client import successful")
except Exception as e:
    print(f"Prisma client import failed: {e}")
