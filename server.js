"use strict";
var chat_session = require('./chat-session');
var serveStatic = require('serve-static');
// Express with server functionality
var	express = require('express');
var app = express();
var server = require('http').Server(app);
// Sockets with real-time data
var io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public')); // used for external files on client


// Routing refers to determining how an application responds to a client request to a particular endpoint
app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});

// Once a browser connects to localhost:8080, the 'connection' event will fire
io.on('connection', function(client){
	 
	var storage = chat_session.default.users.channels;
	
	// Join the chatroom
	client.on('join', (name) => {
		// Alert when new client joins
		client.nickname = name;
		client.broadcast.emit("enter", "* " + client.nickname + " has entered the room *");
		
		// Update current chatters section for new client that joined
		chat_session.default.users.forEach((user) => {
			client.emit('add chatter', user);
		});
		// Update current chatters section for other clients
		client.broadcast.emit('add chatter', client.nickname);
		
		// Update NEW client with most recent messages in the room
		chat_session.default.channels.general.messages.forEach((message) => {
			client.emit("message", message.name + ": " + message.data);
		});
		
		// add new chatters to array in chat-session module
		chat_session.default.users.push(client.nickname);
		
		//console.log(client.nickname + " has joined!!");
	});
	
	client.on('message', (message) => {
		var nickname = client.nickname;
		var room = 'general';
		console.log('Current room ' + room);
		client.broadcast.emit("message", nickname + ": " + message); // send the message to all the other clients except the newly created connection
		client.emit("me", message); // send message to self
		storeMessage(room, nickname, message); // store the message in chat-session
		//notification();
		console.log(nickname + ' said: ' + message); // used for terminal debugging
	});
	
	// client.on('tabChange', ())
});

function storeMessage(room, name, data){
	chat_session.default.channels[room].messages.push({name: name, data: data}); // add message to end of array
	if (chat_session.default.channels[room].messages.length > 10) {
		chat_session.default.channels[room].messages.shift(); // if more than 10 messages long, remove the first one
	}
}

const PORT = 8080;
server.listen(PORT);