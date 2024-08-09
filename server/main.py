from dotenv import load_dotenv
import os
import redis
from fastapi import FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware
from block import Block, BlockAndAuth
import time
from blockchain import Blockchain
import boto3
from verify import validate_user
from transaction import Transaction

load_dotenv()  # Load the environment variables

client = boto3.client('cognito-idp', region_name=os.getenv("AWS_REGION"))  # Load the amplify client

# Connect to the redis instance and wipe the database
r = redis.Redis(
    host=os.getenv('REDIS_HOST'),
    port=os.getenv('REDIS_PORT'),
    password=os.getenv('REDIS_PASSWORD'),
    decode_responses=True
)
#r.flushdb()
r.set("difficulty", os.getenv("DIFFICULTY"))

origins = [
    os.getenv('ORIGIN'),
]
app = FastAPI()  # Start the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

blockchain = Blockchain(r)  # Create the blockhain


@app.get("/blockchain/difficulty")
def get_difficulty():
    return {"difficulty": int(r.get("difficulty"))}

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
    return vars(blockchain.last_block())

@app.get("/blocks/mine")
def get_mine_block():
    last_block = blockchain.last_block()
    block = Block(index=int(last_block.index) + 1,
                  timestamp=int(time.time()),
                  previous_hash=last_block.hash,
                  nonce=0,
                  author="system",
                  hash=""
                  )
    if blockchain.add_block(blockchain.proof_of_work(block)):
        return block
    else:
        return {"message": "Block was not successfully mined"}


@app.get("/user/{user_id}")
def get_user(user_id: str):
    # Set the user in Redis if they exist in Cognito but not in Redis
    try:
        aws_user = client.admin_get_user(UserPoolId=os.getenv('USER_POOL_ID'), Username=user_id)
        if not r.exists(f"user:{aws_user['Username']}"):
            r.hset(f"user:{aws_user['Username']}", mapping={
                "blocks": 0,
                "balance": 0
            })
            r.zadd("user.balance.index", {aws_user['Username']: 0})
            r.incrby("user_count", 1)
    except:
        pass

    user = r.hgetall(f"user:{user_id}")
    if (len(user) == 0):
        return {"message": "User not found"}
    else:
        return user

@app.get("/users/count")
def get_users_count():
    return {"count": r.get("user_count")}

@app.get("/users/top")
def get_top_users():
    return r.zrange(name="user.balance.index", start=0, end=4, withscores=True, desc=True)

@app.post("/block/add")
def add_block(block_and_auth: BlockAndAuth, response: Response):
    auth = ""  # Create the auth object

    # Check to make sure that we are authorized
    try:
        auth = validate_user({"token": block_and_auth.auth}, None)
        assert auth is not False
    except:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"error": "Authentication failed"}

    block = Block(index=block_and_auth.index,
                  timestamp=block_and_auth.timestamp,
                  previous_hash=block_and_auth.previous_hash,
                  nonce=block_and_auth.nonce,
                  author=block_and_auth.author,
                  hash=block_and_auth.hash
                  )
    # Check that the username and block author are the same
    if auth['username'] != block.author:
        response.status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
        return {"error": "Current user and block author are not the same"}

    # Return whether the block was added
    success = blockchain.add_block(block)
    if success:
        return {"success": True}
    else:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"error": "Block is invalid"}



@app.post("/transfer")
def transfer(transaction: Transaction, response: Response):
    auth = ""  # Create the auth object

    # Check to make sure that we are authorized
    try:
        auth = validate_user({"token": transaction.auth}, None)
        assert auth is not False
    except:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"error": "Authentication failed"}

    # Check that the user making the request is the same user in the sender field
    if auth['username'] != transaction.sender:
        response.status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
        return {"error": "Current user and sender are not the same"}

    # Check that the sender has enough money to make the transfer
    if int(r.hget(f"user:{transaction.sender}", "balance")) < transaction.amount:
        response.status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
        return {"error": "Sender does not have enough money to transfer"}

    # Check that the recipient exists
    if not r.exists(f"user:{transaction.recipient}"):
        response.status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
        return {"error": "Recipient does not exist"}

    # Transfer the money
    r.hincrby(f"user:{transaction.sender}", "balance", -1 * transaction.amount)
    r.hincrby(f"user:{transaction.recipient}", "balance", transaction.amount)
    r.zadd("user.balance.index", {transaction.sender: r.hget(f"user:{transaction.sender}", "balance")})
    r.zadd("user.balance.index", {transaction.recipient: r.hget(f"user:{transaction.recipient}", "balance")})

    return {"success": True}



