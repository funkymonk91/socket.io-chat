var socket = io();
var myUsername = '';

$('form').submit(function(){
    var msg = $('#m').val()
    socket.emit('chat message', myUsername, msg);
    $('#messages').append($('<li>').text(msg));
    $('#m').val('');
    return false;
});

$('#m').keyup(function(event) {
    socket.emit('user typing', myUsername);
});

socket.on('user connected', function(userName){
    if(myUsername === '') {
        myUsername = userName;
    }
});

socket.on('message', function(msg) {
    $('#messages').append($('<li>').text(msg));
})

socket.on('user list', function(users) {
    $('#users').empty();
    for (var i = 0; i < users.length; i++) {
        var userName = users[i];
        $('#users').append('<li data-user="'+userName+'">'+userName+' <span class="typingMessage"></span></li>');
    }
});

socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
});

socket.on('user typing', function(userName) {
    if($('#users li[data-user='+userName+'] span.typingMessage').text() === '') {
        $('#users li[data-user='+userName+'] span.typingMessage').text('is typing a message');
    }
    
    setTimeout(function() {
        $('#users li[data-user='+userName+'] span.typingMessage').text('');
    }, 3000);
});