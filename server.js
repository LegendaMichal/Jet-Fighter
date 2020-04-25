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

io.on('connection', socket => {
  console.log('User connected', socket.id, socket.handshake.address);
  
  socket.on('disconnect', reason => {
    console.log('user disconnected');
  });

  
});

servers.listen(port, () => { console.log("Socket server start on port:", port)});