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
const chat_proto_path = __dirname + '/../proto/chat.proto';
const chat_proto = grpc.load(chat_proto_path);

const term = require('terminal-kit').terminal;
term.grabInput(true);

Array.prototype.clear = function() {
  return this.splice(0, this.length);
}

chatBuffer = new Array();
lineEditor = new Array();

function writeStuff(stuff) {
  chatBuffer.push(stuff.trim());
  if (chatBuffer.length >= term.height) {
    chatBuffer.shift();
  }
}

function draw() {
  term.clear();
  term.moveTo(1, 1);
  chatBuffer.forEach(function(line) {
    term(line + '\n');
  });
  term.moveTo(1, term.height);
  lineEditor.forEach(function(c) {
    term.white(c);
  });
}
setInterval(draw, 100);

const chat = new chat_proto.ChatRoom(
  'localhost:8000',
  grpc.credentials.createInsecure());

const room = chat.joinRoom({});
room.on('data', function(message) {
  writeStuff(message.msg);
});
function disconnect() {
  term.clear();
  room.cancel();
  process.exit();
}
room.on('error', disconnect);
room.on('close', disconnect);
room.on('finish', disconnect);

term.on('key', function(name, matches, data) {
  if (data.isCharacter) {
    lineEditor.push(name);
    return;
  }

  // writeStuff(name);
  if (matches.includes('ENTER')) {
    line = lineEditor.join('').trim();

    if (line.length) {
      chat.sendMessage({msg: line}, function(){});
    }

    lineEditor.clear();
  }

  if (matches.includes('BACKSPACE')) {
    lineEditor.pop();
  }

  if (matches.includes('CTRL_C')) {
    disconnect();
  }
});
