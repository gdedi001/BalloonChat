"use strict";
var chat_session = require('./chat-session'),
		serveStatic = require('serve-static'),
		// Express with server functionality
		express = require('express'),
		app = express(),
		server = require('http').Server(app),
		// Sockets with real-time data
		io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public')); // used for external files on client
let storage = chat_session.default; // cache object for storage

// Routing refers to determining how an application responds to a client request to a particular endpoint
app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});

// Once a browser connects to localhost:8080, the 'connection' event will fire
io.on('connection', function(client){
	
	// Join the chatroom
	client.on('join', (name) => {
		// Alert when new client joins
		client.nickname = name;
		// check to see if nickname has been taken, if so, give random name
		if(storage.users.indexOf(client.nickname) !== -1) {client.nickname = randomName();}
		// tell all chatters that a new user has entered the room
		client.broadcast.emit("enter", "* " + client.nickname + " * has connected");
		
		// Update current chatters section for new client that joined
		storage.users.forEach((user) => {
			client.emit('add chatter', user);
		});
		// Update current chatters section for other clients
		client.broadcast.emit('add chatter', client.nickname);
		
		// Update NEW client with most recent messages in the general channel (default)
		storage.channels.general.messages.forEach((message) => {
			client.emit("message", message.name + ": " + message.data, 'general');
		});
		
		// add new chatters to users array in chat-session module
		storage.users.push(client.nickname);
	});
	
	client.on('message', (message, room) => {
		var nickname = client.nickname;
		client.broadcast.emit("message", nickname + ": " + message, room); // send the message to all the other clients except the newly created connection
		client.emit("me", message); // send message to self
		storeMessage(nickname, message, room); // store the message in chat-session
		console.log(nickname + ' said: ' + message + " in room " + room); // used for terminal debugging
	});
	
	// When client switches between tabs (rooms)
	client.on('switch', (room) => {
		storage.channels[room].messages.forEach((message) => {
			if (message.name === client.nickname) { // when reloading a previous channel show (Me) for name rather than actual nickname
				client.emit("me", message.data, room);
			} else {
				client.emit("message", message.name + ": " + message.data, room);
			}
		});
	});
	
});

function storeMessage(name, data, room){
	const messageMax = 12;
	storage.channels[room].messages.push({name: name, data: data}); // add message to end of array
	if (storage.channels[room].messages.length > messageMax) {
		storage.channels[room].messages.shift(); // if more than 10 messages long, remove the first one
	}
}

function randomName(){
	let name = "";
	let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for(let i = 0; i < 5; i++) {
		 name += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return name;
}

const PORT = 8080;
server.listen(PORT);