import redis
from block import Block
import time


class Blockchain:
    difficulty = 1
    r = redis.StrictRedis()  # Junk value, will be overwritten by constructor

    def __init__(self, r: redis):
        genesis = Block(index=0,
                        timestamp=int(time.time()),
                        previous_hash="",
                        nonce=0,
                        author="system",
                        hash=""
                        )
        genesis = self.proof_of_work(genesis)
        self.r = r
        r.hset("block:0", mapping=vars(genesis))
        r.set("block_count", 1)

    def last_block(self):
        last_block = int(self.r.get("block_count")) - 1
        return Block(**self.r.hgetall(f"block:{str(last_block)}"))

    def add_block(self, block: Block) -> bool:
        last_block = self.last_block()

        if block.index != int(last_block.index) + 1: return False  # Check that the index is valid
        if block.compute_hash() != block.hash: return False  # Check that the provided hash is accurate
        if last_block.hash != block.previous_hash: return False  # Check that the previous hashes match
        if block.timestamp < int(last_block.timestamp) or block.timestamp > time.time(): return False  # Check that the # timestamp is valid
        if not self.is_valid_proof(block): return False  # Check that the proof (esp the author/nonce) are valid


        self.r.hset(f"block:{str(block.index)}", mapping=vars(block))
        self.r.incrby("block_count", 1)
        return True

    def is_valid_proof(self, block: Block) -> bool:
        return block.compute_hash().startswith('0' * self.difficulty)

    def proof_of_work(self, block: Block) -> Block:
        block.nonce = 0

        while not self.is_valid_proof(block):
            block.nonce += 1
            block.hash = block.compute_hash()

        return block