var server = require('http').createServer(),
    io = require('socket.io')(server),
    env = require('node-env-file'),
    r = require('rethinkdb'),
    rethinkConfig = require('config.json');

r.connect(rethinkConfig, function (err, conn) {
    // throwing errors in node.js is a no-no
    if(err){
        console.error('Failed to connect to DB');
        return process.exit();
    }

    io.on('connection', function (socket) {
        console.log('Connected to socket with ID of ' + socket.id);

        var dbCallback = function(err, res){
            if(err){
                return console.error('RQL Error:', err);
            }
            return console.log(res);
        }

        socket.on('chat_message', function (data) {
            console.log('Chat message event received: ', data);
            r.table('chat_messages').insert(data).run(conn, dbCallback);
        });

        socket.on('user_join', function (data) {
            console.log('User join event received: ', data);
            r.table('user_joins').insert(data).run(conn, dbCallback);
        });

        socket.on('user_part', function (data) {
            console.log('User parted event received: ', data);
            r.table('user_parts').insert(data).run(conn, dbCallback);
        });

        socket.on('disconnect', function () {
            console.log('Disconnected from socket with ID of ' + socket.id);
        });
    });
});
server.listen(process.env.SERVER_PORT, function(){
    console.log('Listening on port ' + process.env.SERVER_PORT);
});
