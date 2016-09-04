from __future__ import print_function

from concurrent import futures
import signal
import threading
import grpc

from _grpc import chat_pb2


class ChatRoom(chat_pb2.ChatRoomServicer):
    def __init__(self, *args, **kwargs):
        super(ChatRoom, self, *args, **kwargs)
        self.x = 0

    def joinRoom(self, request, context):
        pass

    def sendMessage(self, request, context):
        print(request.msg, self.x)
        self.x += 1
        return chat_pb2.MessageAck()


def make_server():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    chat_pb2.add_ChatRoomServicer_to_server(ChatRoom(), server)
    server.add_insecure_port('[::]:8000')
    server.start()

    try:
        signal.pause()
    finally:
        server.stop(0)


if __name__ == '__main__':
    make_server()

