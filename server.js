"use strict";
// Redis DB
var redis = require('redis');
var redisClient = redis.createClient();
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
	
	// JOIN event handler
	client.on('join', function(name){
		// get a range of elements, in this case 0, -1 indicates ALL 
		redisClient.lrange("messages", 0, -1, function(err, messages){
			messages = messages.reverse(); // reverse so that they are emmited in most recent order
			messages.forEach(function(message){
				message = JSON.parse(message)
				client.emit("messages", message.name + ": " + message.data);
			});
		});
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

var storeMessage = function(name, data){
	// converts value to a JSON string for storage in Redis
	var message = JSON.stringify({name: name, data: data});
	
	redisClient.lpush("messages", message, function(err, response){
		// always keeps newest 10 items in array
		redisClient.ltrim("messages", 0, 9);
	});
};

server.listen(8080);