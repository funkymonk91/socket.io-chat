var express = require('express');
var app  = require('express')();
var http = require('http').Server(app);
var io   = require('socket.io')(http);
var path = require('path');

var allClients = [];

app.use('/css', express.static(path.join(__dirname, '/public/css')));
app.use('/js', express.static(path.join(__dirname, '/public/js')));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

function generateUser() {
    return 'user'+Math.floor((Math.random() * 9999) + 1);
}

function getUserList() {
    var userList = [];

    for (var i = 0; i < allClients.length; i++) {
        userList.push(allClients[i]['userName']);
    }

    return userList;
}

io.on('connection', function(socket) {
    var userName = generateUser(); // Generate a username for the new user
    socket.userName = userName; // Create a userName property on the socket object to track

    allClients.push(socket); // add the socket to our global client list

    io.emit('user list', getUserList()); // send the currentUserList to the new client

    console.log(userName+' connected!');
    io.emit('user connected', userName);

    socket.on('disconnect', function(){
        console.log(socket);
        console.log(socket['user'] + ' disconnected');

        var i = allClients.indexOf(socket);
        allClients.splice(i, 1);

        io.emit('user list', getUserList());
    });

    socket.on('chat message', function(userName, msg){
        console.log(userName + ': ' + msg);
        var now = new Date().toISOString();
        var message = now + ' ' + userName + ': ' + msg;
        socket.broadcast.emit('chat message', message);
    });

    socket.on('user typing', function(userName){
        console.log('user typing ' + userName);
        // io.emit('user typing', userName);
        socket.broadcast.emit('user typing', userName);
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});