const {createServer} = require('http');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

const app = express();

// Express server
const normalizePort = port => parseInt(port, 10);
const PORT = normalizePort(process.env.PORT || 5000);

app.disable('x-powered-by');
app.use(compression());
app.use(morgan('common'));

app.use(express.static(path.resolve(__dirname, 'build')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

const server = createServer(app);

server.listen(PORT, err => {
    if (err) throw err;

    console.log("Server started on port", PORT);
});

// Web Socket server
const port = 3011;
var servers = require('http').createServer(app);
var io = require('socket.io')(servers);
const UserList = require('./src/server/userlist.js');
var users = new UserList();

io.on('connection', socket => {
    users.addUser(socket.id);
    console.log(users);
    socket.join("abc");
    socket.emit('my_id', { id: socket.id });
    socket.broadcast.to('abc').emit('player_join', { id: socket.id });

    socket.on('disconnect', reason => {
        socket.leaveAll();
        socket.broadcast.to('abc').emit('player_left', { id: socket.id });
        users.removeUser(socket.id);
    });

    socket.on('player_data', data => {
        socket.broadcast.to('abc').emit('other_update', data);
    })
});

servers.listen(port, () => { console.log("Socket server start on port:", port)});