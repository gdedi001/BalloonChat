"use strict"
var insertMessage = function(message){
	var newMessage = $(`<li>${message}</li>`);

	var messages = $('#messages')[0];
	messages.append(newMessage);
};