import os
import rq
from redis import Redis
from rq import Worker, Queue

# Make sure we use the same Redis connection as api.py
redis_conn = Redis.from_url(os.getenv('REDIS_URL', 'redis://localhost:6379/0'))

if __name__ == '__main__':
    print("Starting RQ worker...")
    queue = Queue('default', connection=redis_conn)
    worker = Worker([queue], connection=redis_conn)
    worker.work()
