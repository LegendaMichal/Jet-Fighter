const {createServer} = require('http');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

const app = express();
const server = createServer(app);
var io = require('socket.io')(server);

// Express server
const normalizePort = port => parseInt(port, 10);
const PORT = normalizePort(process.env.PORT || 80);

app.disable('x-powered-by');
app.use(compression());
app.use(morgan('common'));

app.use(express.static(path.resolve(__dirname, 'build')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});



// Web Socket server
// const UserList = require('./src/server/userlist.js');
// var users = new UserList();

io.on('connection', socket => {
    // users.addUser(socket.id);
    // console.log(users);
    socket.join("abc");
    socket.emit('my_id', { id: socket.id });
    socket.broadcast.to('abc').emit('player_join', { id: socket.id });

    socket.on('disconnect', reason => {
        socket.leaveAll();
        socket.broadcast.to('abc').emit('player_left', { id: socket.id });
        // users.removeUser(socket.id);
    });

    socket.on('player_data', data => {
        socket.broadcast.to('abc').emit('other_update', data);
    })
});


server.listen(PORT, err => {
    if (err) throw err;

    console.log("Server started on port", PORT);
});