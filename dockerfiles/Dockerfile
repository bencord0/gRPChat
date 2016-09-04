FROM bencord0/pypy

WORKDIR /app

ADD ./protobuf-3.0.0-1.xpak.tar.bz2 /
RUN ldconfig

ADD ./protobuf-3.0.0-cp34-cp34-linux_x86_64.whl /tmp/
ADD ./protobuf-3.0.0-cp27-cp27mu-linux_x86_64.whl /tmp/

RUN pypy -m pip install -U cython
RUN python2 -m pip install -U cython
RUN python3 -m pip install -U cython

RUN pypy -m pip install protobuf
RUN python2 -m wheel install /tmp/protobuf-3.0.0-cp27-cp27mu-linux_x86_64.whl
RUN python3 -m wheel install /tmp/protobuf-3.0.0-cp34-cp34-linux_x86_64.whl

ADD python/requirements.txt /tmp/requirements.txt
RUN pypy -m pip install -U -r /tmp/requirements.txt
RUN python2 -m pip install -U -r /tmp/requirements.txt
RUN python3 -m pip install -U -r /tmp/requirements.txt

ADD python /app
