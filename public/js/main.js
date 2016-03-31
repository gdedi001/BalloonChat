"use strict"
var server = io.connect("http://localhost:8080");

server.on('connect', function(data){
	nickname = prompt("What is your nickname?");
	server.emit('join', nickname); // notify the server of the users nickname
});

// new chatter enters room
server.on('enter', function(data){
	$('#messages').append($('<li style="background:#33cc33; color:white">').text(data));
});

// connected chatters section
server.on('add chatter', function(name){
	var chatter = $('<li style="color:#b3b3b3; font-size:22px">' + name + '</li>').data('name', name);
	$('#users').append(chatter);
});

// chatters sends message
server.on('message', function(message){
	$('#messages').append($('<li style="display:table; box-shadow: 6px 3px 8px grey;">').text(message));
	$('audio').play();
});

// differentiate how the client sees their message
server.on('me', function(message){
	$('#messages').append($('<li style="background:#0066ff; color:white; display:table; box-shadow: 6px 3px 8px grey;">').text(message));
});

$('#chat_form').submit(function(e){
	var message = $("#chat_input").val();
	server.emit('message', message);
	$('#chat_input').val(''); // Make input box blank for new message
	return false; // prevents refresh of page after submit
});