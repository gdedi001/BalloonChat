"use strict";
var	express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

// Routing refers to determining how an application responds to a client request to a particular endpoint
app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});

// Once a browser connects to localhost:8080, the 'connection' event will fire
io.on('connection', function(client){
	console.log('client connected...');
	
	// listen for answers
	client.on('answers', function(message, answer){
		client.broadcast.emit('answer', message, answer);
	});

	// listen for messages
	client.on('message', function(message){
		/* uncomment for 1 message per client

		if (!client.question_asked) {
			client.question_asked = true;
			client.broadcast.emit('message', message);
		}
		*/
		client.broadcast.emit('message', message);
		console.log('message: ' + message);
	});
});

server.listen(8080);