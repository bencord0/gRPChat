#!/bin/sh
set -ex

mkdir -p _grpc
pypy -m grpc.tools.protoc \
    --python_out=_grpc \
    --grpc_python_out=_grpc \
    --proto_path=/proto/ \
    /proto/chat.proto
