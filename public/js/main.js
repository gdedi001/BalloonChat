var server = io.connect("http://localhost:8080"); // connect to our server
var curRoom = $('.nav .active').attr('id'); // cache current room

server.on('connect', function(data){
		nickname = prompt("What is your nickname?");
		server.emit('join', nickname); // notify the server of the users nickname
});

// new chatter enters room
server.on('enter', function(data){
		$('#messages').append($('<li style="background:#33cc33; color:white">').text(data));
});

// connected users section
server.on('add chatter', function(name){
		var chatter = $('<li style="color:white; font-size:22px">' + name + '</li>').data('name', name);
		$('#users').append(chatter);
});

// user sends message (not client)
server.on('message', function(message){
		$('#messages').append($('<li style="display:table; box-shadow: 6px 3px 8px grey;">').text(message));
		//play();
});

// differentiate how the client sees their message
server.on('me', function(message){
		$('#messages').append($('<li style="background:#0066ff; color:white; display:table; box-shadow: 6px 3px 8px grey;">').text(message));
});

// Client submits message
$('#chat_form').submit(function(e){
		var message = $("#chat_input").val();
		server.emit('message', message, curRoom);
		$('#chat_input').val(''); // Make input box blank for new message
		return false; // prevents refresh of page after submit
});

function changeTab(){
		$('.nav').find('.active').removeClass();
		$(this).addClass('active');
		curRoom = $(this).attr('id');
};

// change room tabs
$('.nav li').on('click', function(){
		changeTab();
		server.emit('switch', curRoom);
		$('#messages').empty();
		console.log(curRoom);
	
		if(curRoom === 'other'){
			alert('Comming soon');
			curRoom = 'general';
			server.emit('switch', curRoom);
		}
});