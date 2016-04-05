// Create function that handles notification sound
function play() {
    var audio = document.getElementById('audio');
    audio.play();
}

$(document).ready(function(){
	$('#private').on('click', function(){
		alert('Click on a user to send private message.');
	});
	
	// change room tabs
	$('.nav li').on('click', function(){
			$('.nav').find('.active').removeClass();
			$(this).addClass('active');
			curRoom = $(this).attr('id');

			server.emit('switch', curRoom); // tell the server the client has switched rooms

			$('#messages').empty();
			console.log(curRoom);
	});	
});