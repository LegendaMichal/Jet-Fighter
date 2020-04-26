const Lobby = require('./lobby');

class LobbyList {
    constructor(args) {
        this.lobbyArray = [];
    }

    addLobby(lobby) {
        const newLobby = new Lobby({
            ...lobby, 
            aboutToClose: this.removeLobby(lobby.id)
        });
        this.lobbyArray.push(newLobby);
        return newLobby;
    }

    copyLobby(lobby) {
        this.lobbyArray.push(lobby);
    }

    getLobby(lobbyId) {
        return this.lobbyArray.find(lobby => lobby.id === lobbyId);
    }
    
    getLobbyByPlayer(playerId) {
        return this.lobbyArray.find(lobby => 
            lobby.players.some(player => player.id === playerId)
            );
    }

    removeLobby(lobbyId) {
        this.lobbyArray = this.lobbyArray.filter(lobby => lobbyId !== lobby.id);
    }

    getLobbiesInfo() {
        return this.lobbyArray.map(lobby => lobby.getData());
    }

    removePlayerFrom(lobbyId, playerId) {
        const lobby = this.lobbyArray.find(lobby => lobby.id === lobbyId);
        if (lobby === undefined)
            return lobby;
        lobby.removePlayer(playerId);
        return lobby;
    }
}

module.exports = LobbyList;