"use strict";
/* Redis DB
var redis = require('redis');
var redisClient = redis.createClient(); */
var chat_session = require('./chat-session');
// Express with server functionality
var	express = require('express');
var app = express();
var server = require('http').Server(app);
// Sockets with real-time data
var io = require('socket.io').listen(server);
const PORT = 8080;

// Routing refers to determining how an application responds to a client request to a particular endpoint
app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});

// Once a browser connects to localhost:8080, the 'connection' event will fire
io.on('connection', function(client){
	
	// CLIENT -> SERVER:JOIN event handler
	client.on('join', function(name){
		chat_session.default.messages.forEach(function(message){
			client.emit("message", message.name + ": " + message.data);
		});
		
		client.nickname = name;
		client.broadcast.emit("enter", "CHAT ALERT: " + name + " has entered the room");
		// add new chatters to array in chat-session module
		chat_session.default.users.push(client.nickname);
		chat_session.default.count++; // update amount of chatters in the room
		
		console.log(client.nickname + " has joined!!");
	});
	
	client.on('message', function(message){
		var nickname = client.nickname;
		client.broadcast.emit("message", nickname + ": " + message); // send the message to all the other clients except the newly created connection
		client.emit("me", nickname + ": " + message); // send message to self
		storeMessage(nickname, message); // store the message in chat-session
		console.log(nickname + ' said: ' + message); // used for terminal debugging
	});
	
	//TODO: figure out usage of this function
//	client.on('answers', function(message, answer){
//		client.broadcast.emit('answer', message, answer);
//	});
});

function storeMessage(name, data){
	chat_session.default.messages.push({name: name, data: data}); // add message to end of array
	if (chat_session.default.messages.length > 10) {
		chat_session.default.messages.shift(); // if more than 10 messages long, remove the first one
	}
}
		
server.listen(PORT);