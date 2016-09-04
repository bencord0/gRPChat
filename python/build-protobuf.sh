#!/bin/sh
set -ex

# Hack, no ebuild available
git clone https://github.com/bencord0/portage-overlay /usr/local/portage

# Build libprotobuf.so
emerge --onlydeps protobuf
ebuild /usr/local/portage/dev-libs/protobuf/protobuf-3.0.0.ebuild package

cp /var/lib/portage/packages/dev-libs/protobuf/protobuf-3.0.0-1.xpak /app/
qtbz2 -sv /app/protobuf-3.0.0-1.xpak


# Build python protobuf bindings linked against libprotobuf.so
git clone https://github.com/google/protobuf -b 3.0.x || true
cd protobuf/python

python2 setup.py --cpp_implementation bdist_wheel
python3 setup.py --cpp_implementation bdist_wheel
pypy setup.py --cpp_implementation bdist_wheel

cp dist/*.whl /app/
