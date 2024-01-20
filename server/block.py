import json
from hashlib import sha256
import time


class Block:
    def __init__(self, index: int, timestamp: int, previous_hash: str, nonce: int, author: str, hash: str) -> None:
        self.index = index
        self.timestamp = timestamp
        self.previous_hash = previous_hash
        self.nonce = nonce
        self.author = author
        self.hash = self.compute_hash()

    def compute_hash(self):
        block_string = str(self.index) + str(self.timestamp) + str(self.previous_hash) + str(self.nonce) + self.author
        return sha256(block_string.encode()).hexdigest()