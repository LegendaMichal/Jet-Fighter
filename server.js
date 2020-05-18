const {createServer} = require('http');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

const app = express();
const server = createServer(app);
var io = require('socket.io')(server);
const LobbyList = require('./src/server/lobbylist');
const UserList = require('./src/server/userlist');
const User = require('./src/server/user');

var lobbies = new LobbyList();
var games = new LobbyList();

var userList = new UserList();

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


    // Lobby container
    socket.on('enter_menu', () => {
        socket.join('menu');
        socket.emit('update_lobbies', lobbies.getLobbiesInfo());
    });
    socket.on('leave_menu', () => {
        socket.leave('menu');
    });

    // Lobby management
    socket.on('new_lobby', data => {
        const lobbyObj = {...data, id: generateId() }
        const lobby = lobbies.addLobby(lobbyObj);
        socket.join(lobby.id);
        const user = userList.users.find(usr => usr.socketIds.includes(socket.id));
        lobby.addPlayer({id: user.id, name: user.name, hp: 100, socketId: socket.id });
        socket.emit('enter_lobby', lobby.getDetails());
        socket.broadcast.to('menu').emit('update_lobbies', lobbies.getLobbiesInfo());
    });
    socket.on('leave_lobby', (lobbyId) => {
        const user = userList.users.find(usr => usr.socketIds.includes(socket.id));
        const lobby = lobbies.removePlayerFrom(lobbyId, user.id);
        if (lobby === undefined)
            return; // nenaslo sa lobby
        socket.leave(lobby.id);
        socket.emit('leave_lobby');
        if (lobby.getPlayers().length === 0) {
            lobbies.removeLobby(lobbyId);
        } else {
            socket.broadcast.to(lobbyId).emit('update_lobby', lobby.getDetails());
        }
        socket.emit('update_lobbies', lobbies.getLobbiesInfo());
        socket.to('menu').emit('update_lobbies', lobbies.getLobbiesInfo());
    });
    socket.on('try_join_lobby', data => {
        let lobby = lobbies.getLobby(data.lobbyId);
        if (lobby === undefined) {
            socket.emit('update_lobbies', lobbies.getLobbiesInfo());
        } else {
            const user = userList.users.find(usr => usr.socketIds.includes(socket.id));
            socket.join(lobby.id);  
            if (lobby.addPlayer({id: user.id, name: user.name, hp: 100, socketId: socket.id })) {  
                socket.broadcast.to(lobby.id).emit('update_lobby', lobby.getDetails());
                socket.broadcast.to('menu').emit('update_lobbies', lobbies.getLobbiesInfo());
            }
            socket.emit('enter_lobby', lobby.getDetails());
        }
    });
    socket.on('start_game', lobbyId => {
        const lobby = lobbies.getLobby(lobbyId);
        lobbies.removeLobby(lobbyId);
        games.copyLobby(lobby);
        
        const user = userList.users.find(user => user.socketIds.some(socId => socId === socket.id));
        socket.to('menu').emit('update_lobbies', lobbies.getLobbiesInfo());
        user.inGame = true;
        user.socketIds.forEach(socId => {
            if (socId !== socket.id)
                socket.to(socId).emit('user_is_in_game', true);
        });
        socket.emit('load_game', lobbyId);
        socket.to(lobbyId).emit('load_game', lobbyId);
    });
    socket.on('ready', sessionId => {
        const user = userList.users.find(user => user.socketIds.some(socId => socId === socket.id));
        const game = games.getLobbyByPlayer(user.id);
        if (game === undefined) {
            console.log("unable to find game");
            return;
        }
        const player = game.players.find(player => player.id === user.id);
        if (player === undefined){
            console.log("unable to find player");
            return;
        }
        socket.emit('my_id', { id: user.id, hp: player.hp });
        socket.broadcast.to(sessionId).emit('player_join', { id: user.id });
        socket.emit('update_health', game.healthData());
        socket.broadcast.to(game.getId()).emit('update_health', game.healthData());
    });

    // Gameplay
    socket.on('player_data', data => {
        const user = userList.users.find(user => user.socketIds.some(socId => socId === socket.id));
        if (user === undefined) {
            console.log("unable to find user");
            return;
        }
        const lobby = games.getLobbyByPlayer(user.id);
        if (lobby)
            socket.broadcast.to(lobby.getId()).emit('other_update', data);
        else
            console.log('unable to find lobby');
    });
    socket.on('enemy_hit', data => {
        const user = userList.users.find(user => user.socketIds.some(socId => socId === socket.id));
        if (user === undefined) {
            console.log("unable to find user");
            return;
        }
        let game = games.getLobbyByPlayer(user.id);
        if (game) {
            const player = game.playerDamaged(data.id);
            if (player.hp <= 0) {
                const pos = game.players.filter(player => !player.detroyed).length;
                socket.to(player.socketId).emit('lost', pos);
                socket.broadcast.to(game.id).emit('player_left', { id: user.id });
                player.destroyed = true;
                console.log(game.players, pos);
                if  (pos <= 2) {
                    const winner = game.players.find(player => !player.destroyed);
                    if (socket.id === winner.socketId) {
                        socket.emit('winner', true);
                    } else {
                        socket.to(winner.socketId).emit('winner', true);
                    }
                    socket.broadcast.to(game.id).emit('player_left', { id: winner.id });
                }
            }
            socket.emit('update_health', game.healthData());
            socket.broadcast.to(game.getId()).emit('update_health', game.healthData());
        }
    });
    socket.on('delete_player_from_game', () => {
        const user = userList.users.find(user => user.socketIds.some(socId => socId === socket.id));
        if (user === undefined) {
            console.log("unable to find user");
            return;
        }
        const game = games.getLobbyByPlayer(user.id);
        if (game === undefined) {
            console.log("unable to find game");
            return;
        }
        games.removePlayerFrom(game.id, user.id);
        if (game.players.length <= 0) {
            games.removeLobby(game.id);
        }
    })
    socket.on('reconnect_attempt', attempt => {
        console.log("try to reconnected");
        const user = userList.users.find(user => user.socketIds.some(socId => socId === socket.id));
        if (user === undefined) {
            console.log("unable to find user");
            return;
        }
        const game = games.getLobbyByPlayer(user.id);
        if (game === undefined) {
            console.log("unable to find game");
            return;
        }
        const player = game.players.find(player => player.id === user.id);
        if (player === undefined){
            console.log("unable to find player");
            return;
        }
        socket.to(player.socketId).emit('disconnect_from_game', true);
        player.socketId = socket.id;
        socket.emit('load_game', game.id);
        console.log("reconnected");
    });


    // Register/Login communication
    socket.on('partial_login', data => {
        if (userList.users.some(user => user.id === data.id)){
            let user = userList.users.find(user => user.id === data.id);
            if (!user.socketIds.some(id => socket.id === id))
                user.socketIds.push(socket.id);
            if (user.inGame) {
                const game = games.getLobbyByPlayer(user.id);
                if (game === undefined) {
                    console.log("unable to find game");
                    return;
                }
                const player = game.players.find(player => player.id === user.id);
                if (player === undefined){
                    console.log("unable to find player");
                    return;
                }
                if (player.socketId !== socket.id)
                    socket.emit('user_is_in_game', true);
            }
        } else {
            userList.addUser(new User({
                id: data.id, socketId: socket.id, name: data.name, 
            }));
        }
    });
    socket.on('register_attempt', () => {});
    socket.on('login_attempt', () => {});
    
    // utils
    socket.on('name_change', data => {
        let user = userList.users.find(user => user.id === data.id);
        if (user !== undefined)
            user.name = data.name;
    })

    // On Disconnect
    socket.on('disconnect', reason => {
        socket.leaveAll();
        const user = userList.users.find(user => user.socketIds.some(socId => socId === socket.id));
        if (user === undefined) {
            console.log("unable to find user");
            return;
        }
        const lobby = games.getLobbyByPlayer(user.id);
        if (lobby) {
            const lId = lobby.id;
            socket.broadcast.to(lId).emit('player_left', { id: user.id });
            lobby.removePlayer(user.id);
        } else {

        }
    });
});


server.listen(PORT, err => {
    if (err) throw err;

    console.log("Server started on port", PORT);
});

function generateId() {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 40; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}