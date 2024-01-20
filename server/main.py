from dotenv import load_dotenv
import os
import redis
from fastapi import FastAPI
from block import Block
import time
from blockchain import Blockchain

load_dotenv()  # Load the environment variables

# Connect to the redis instance and wipe the database
r = redis.Redis(
    host=os.getenv('REDIS_HOST'),
    port=os.getenv('REDIS_PORT'),
    password=os.getenv('REDIS_PASSWORD'),
    decode_responses=True
)
r.flushdb()

app = FastAPI()  # Start the API

blockchain = Blockchain(r)  # Create the blockhain


@app.get("/block/{block_number}")
def get_block(block_number: int):
    block = r.hgetall(f"block:{block_number}")
    if (len(block) == 0):
        return {"message": "Block not found"}
    else:
        return block


@app.get("/blocks/count")
def get_block_count():
    return {"count": r.get("block_count")}


@app.get("/blocks/last")
def get_last_block():
    print(blockchain.last_block())
    return vars(blockchain.last_block())

@app.get("/blocks/mine")
def get_mine_block():
    last_block = blockchain.last_block()
    print(vars(last_block))
    block = Block(int(last_block.index) + 1, int(time.time()), last_block.hash, 0, "system", "")
    if blockchain.add_block(blockchain.proof_of_work(block)):
        return block
    else:
        return {"message": "Block was not successfully mined"}


@app.get("/user/{user_id}")
def get_user(user_id: str):
    user = r.hgetall(f"user:{user_id}")
    if (len(user) == 0):
        return {"message": "User not found"}
    else:
        return user


