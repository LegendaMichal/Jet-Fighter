const Player = require('./player');

class Lobby {
    constructor(args) {
        this.id = args.id;
        this.name = args.name; 
        this.maxPlayers = args.maxPlayers;
        this.players = [];
    }

    getData() {
        return {
            id: this.id,
            pId: this.pId,
            name: this.name,
            maxPlayers: this.maxPlayers,
            players: this.players,
            playersCount: this.players.length
        };
    }
    
    getDetails() {
        return {
            id: this.id,
            pIds: this.pIds,
            name: this.name,
            maxPlayers: this.maxPlayers,
            playersCount: this.players.length,
            playerNames: this.players.map(player => player.getData())
        };
    }

    addPlayer(playerObj) {
        if (!this.players.some(player => player.id === playerObj.id)) {
            this.players.push(new Player(playerObj));
            return true;
        }
        return false;
    }

    playerDamaged(id) {
        let player = this.players.find(player => {
            return player.id === id;
        });
        player.damaged();
        return player;
    }

    healthData() {
        return this.players.map(player => {
            return {
                id: player.id, name: player.name, hp: player.hp
            }
        });
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