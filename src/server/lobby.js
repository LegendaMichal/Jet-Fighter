const Player = require('./player');

class Lobby {
    constructor(args) {
        this.id = args.id;
        this.name = args.name; 
        this.maxPlayers = args.maxPlayers;
        this.close = args.aboutToClose;
        this.players = [];
    }

    getData() {
        return {
            id: this.id,
            name: this.name,
            maxPlayers: this.maxPlayers,
            playersCount: this.players.length
        };
    }
    
    getDetails() {
        return {
            id: this.id,
            name: this.name,
            maxPlayers: this.maxPlayers,
            playersCount: this.players.length,
            playerNames: this.players.map(player => player.getData())
        };
    }

    addPlayer(playerObj) {
        if (this.players.filter(player => player.id === playerObj.id).length === 0) {
            this.players.push(new Player(playerObj));
        }
    }

    removePlayer(playerId) {
        this.players = this.players.filter(player => player.id !== playerId);
    }

    getId() {
        return this.id;
    }

    getPlayers() {
        return this.players;
    }
}

module.exports = Lobby;