const {createServer} = require('http');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

const app = express();
const server = createServer(app);
var io = require('socket.io')(server);
const LobbyList = require('./src/server/lobbylist');

var lobbies = new LobbyList();
var games = new LobbyList();

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
io.on('connection', socket => {
/// TODO default meno // socket.emit('defaultName', ) 
    socket.on('enter_menu', () => {
        socket.join('menu');
        socket.emit('update_lobbies', lobbies.getLobbiesInfo());
    });
    socket.on('leave_menu', () => {
        socket.leave('menu');
    });

    socket.on('new_lobby', data => {
        const lobbyObj = {...data, id: socket.id }
        const lobby = lobbies.addLobby(lobbyObj);
        socket.join(lobby.id);
        lobby.addPlayer({id: socket.id, name: data.playerName});
        socket.emit('enter_lobby', lobby.getDetails());
        socket.broadcast.to('menu').emit('update_lobbies', lobbies.getLobbiesInfo());
    });
    socket.on('leave_lobby', (lobbyId) => {
        const lobby = lobbies.removePlayerFrom(lobbyId, socket.id);
        if (lobby === undefined)
            return; // nenaslo sa lobby
        socket.leave(lobby.id);
        socket.emit('leave_lobby');
        if (lobby.getPlayers().length === 0) {
            lobbies.removeLobby(lobbyId);
        } else {
            socket.broadcast.to(lobbyId).emit('update_lobby', lobby.getDetails());
        }
        socket.to('menu').emit('update_lobbies', lobbies.getLobbiesInfo());
    });
    socket.on('try_join_lobby', data => {
        const lobby = lobbies.getLobby(data.lobbyId);
        if (lobby === undefined) {
            socket.emit('update_lobbies', lobbies.getLobbiesInfo());
        } else {
            socket.join(lobby.id);
            lobby.addPlayer({id: socket.id, name: data.playerName});
            socket.emit('enter_lobby', lobby.getDetails());
            socket.broadcast.to(lobby.id).emit('update_lobby', lobby.getDetails());
            socket.broadcast.to('menu').emit('update_lobbies', lobbies.getLobbiesInfo());
        }
    });
    socket.on('start_game', lobbyId => {
        const lobby = lobbies.getLobby(lobbyId);
        lobbies.removeLobby(lobbyId);
        games.copyLobby(lobby);
        
        socket.to('menu').emit('update_lobbies', lobbies.getLobbiesInfo());
        socket.emit('load_game', lobbyId);
        socket.to(lobbyId).emit('load_game', lobbyId);
    });
    socket.on('ready', sessionId => {
        socket.emit('my_id', { id: socket.id });
        socket.broadcast.to(sessionId).emit('player_join', { id: socket.id });
    });

    socket.on('disconnect', reason => {
        socket.leaveAll();
        const lobby = games.getLobbyByPlayer(socket.id);
        if (lobby) {
            socket.broadcast.to(lobby.id).emit('player_left', { id: socket.id });
        } else {

        }
    });

    socket.on('player_data', data => {
        const lobby = games.getLobbyByPlayer(socket.id);
        if (lobby)
            socket.broadcast.to(lobby.getId()).emit('other_update', data);
    })
});


server.listen(PORT, err => {
    if (err) throw err;

    console.log("Server started on port", PORT);
});