
bash:
	docker-compose -f docker-compose.yml run grpchat bash
pypy:
	docker-compose -f docker-compose.yml run grpchat pypy server.py
python2:
	docker-compose -f docker-compose.yml run grpchat python2 server.py
python3:
	docker-compose -f docker-compose.yml run grpchat python3 server.py

build: python/_grpc/chat_pb2.py protobuf-3.0.0-1.xpak.tar.bz2
	docker-compose -f docker-compose.yml build grpchat

protobuf-3.0.0-1.xpak.tar.bz2::
	docker-compose -f docker-compose-protobuf.yml run protobuf

python/_grpc/chat_pb2.py:
	docker-compose -f docker-compose-grpcio.yml run grpcio
