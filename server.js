var server = require('http').createServer(),
    io = require('socket.io')(server),
    env = require('node-env-file'),
    r = require('rethinkdb');

env(__dirname + '/.env');

r.connect({host: 'localhost', port: 28015}, function (err, conn) {
    if (err) throw err;

    console.log('Listening on port ' + process.env.SERVER_PORT);

    io.on('connection', function (socket) {
        console.log('Connected to socket with ID of ' + socket.id);

        socket.on('chat_message', function (data) {
            console.log('Chat message event received: ' + JSON.stringify(data));
            r.db(process.env.RETHINKDB_TABLE).table('chat_messages').insert(data).run(conn, function (err, res) {
                if (err) throw err;
                console.log(res);
            });
        });

        socket.on('user_join', function (data) {
            console.log('User join event received: ' + JSON.stringify(data));
            r.db(process.env.RETHINKDB_TABLE).table('user_joins').insert(data).run(conn, function (err, res) {
                if (err) throw err;
                console.log(res);
            });
        });

        socket.on('user_part', function (data) {
            console.log('User parted event received: ' + JSON.stringify(data));
            r.db(process.env.RETHINKDB_TABLE).table('user_parts').insert(data).run(conn, function (err, res) {
                if (err) throw err;
                console.log(res);
            });
        });

        socket.on('disconnect', function () {
            console.log('Disconnected from socket with ID of ' + socket.id);
        });
    });

    server.listen(process.env.SERVER_PORT);
});