from hashlib import sha256
from pydantic import BaseModel


class Block(BaseModel):
    index: int
    timestamp: int
    previous_hash: str
    nonce: int
    author: str
    hash: str

    def compute_hash(self):
        block_string = str(self.index) + str(self.timestamp) + str(self.previous_hash) + str(self.nonce) + self.author
        return sha256(block_string.encode()).hexdigest()


class BlockAndAuth(Block):
    auth: str
