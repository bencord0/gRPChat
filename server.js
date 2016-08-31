#!/usr/bin/env node
/* Copyright (C) 2016 Ben Cordero.

   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

const grpc = require('grpc');

const chat_proto_path = __dirname + '/proto/chat.proto';
const chat_proto = grpc.load(chat_proto_path);

const the_room = new Array();

function pop(arr, i) {
  if (arr.includes(i)) {
    return arr.splice(arr.indexOf(i), 1);
  }
}

function joinRoom(call) {
  the_room.push(call);
  _sendMessage(call.getPeer(), 'joined');
  function disconnect() {
    pop(the_room, call);
    _sendMessage(call.getPeer(), 'disconnected');
    debugger;
  }
  call.on('error', disconnect);
}

function sendMessage(call, callback) {
  _sendMessage(call.getPeer(), call.request.msg);
  callback(null, {});
}

function _sendMessage(sender, msg) {
  text = sender + ': ' + msg;
  console.log(text);
  the_room.forEach(function (channel) {
    channel.write(text);
  });
}

function make_server(connect) {
  const server = new grpc.Server();
  server.addProtoService(chat_proto.ChatRoom.service, {
    joinRoom: joinRoom,
    sendMessage: sendMessage
  });
  server.bind(connect,
              grpc.ServerCredentials.createInsecure());
  return server
}

function main() {
  make_server('0.0.0.0:8000').start()
}
main();
