from __future__ import print_function

from concurrent import futures
import grpc
from _grpc import chat_pb2

channel = grpc.insecure_channel('localhost:8000')
stub = chat_pb2.ChatRoomStub(channel)

executor = futures.ThreadPoolExecutor(max_workers=10)

def main():
    stub.sendMessage(chat_pb2.ChatMessage(msg='Hello World'))

def run(count):
    results = {executor.submit(main) for _ in range(count)}
    for future in futures.as_completed(results):
        future.result()

if __name__ == '__main__':
    main()
