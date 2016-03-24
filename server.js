"use strict";
// Redis DB
var redis = require('redis');
// Express with server functionality
var	express = require('express');
var app = express();
var server = require('http').Server(app);
// Sockets with real-time data
var io = require('socket.io').listen(server);

// Routing refers to determining how an application responds to a client request to a particular endpoint
app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});

// Once a browser connects to localhost:8080, the 'connection' event will fire
io.on('connection', function(client){
	console.log('client connected...');
	
	client.on('join', function(name){
		// 'socket.broadcast.emit' will send the message to all the other clients except the newly created connection
		client.broadcast.emit();
	});
	
	// ANSWERS event handler
	client.on('answers', function(message, answer){
		client.broadcast.emit('answer', message, answer);
	});

	// MESSAGES event handler
	client.on('message', function(message){
		client.broadcast.emit('message', message);
		console.log('message: ' + message);
	});
});

server.listen(8080);