var server = require('http').createServer(),
    io = require('socket.io')(server),
    env = require('node-env-file');

env(__dirname + '/.env');

var port = process.env.PORT;

// Logger config
console.log('Listening on port ' + port);

io.on('connection', function (socket) {
    console.log('Connected to socket with ID of ' + socket.id);

    socket.on('chat_message', function (data) {
        console.log('Chat message event received: ' + JSON.stringify(data));
    });

    socket.on('user_join', function (data) {
        console.log('User join event received: ' + JSON.stringify(data));
    });

    socket.on('user_part', function (data) {
        console.log('User parted event received: ' + JSON.stringify(data));
    });

    socket.on('disconnect', function () {
        console.log('Disconnected from socket with ID of ' + socket.id);
    });
});

server.listen(port);