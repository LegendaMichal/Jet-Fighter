class Player {
    constructor(args) {
        this.id = args.id;
        this.socketId = args.socketId;
        this.name = args.name;
        this.hp = args.hp;
        this.destroyed = false;
    }

    damaged() {
        this.hp -= Math.random * 8 + 2;
        return this.hp;
    }

    getData() {
        return {
            id: this.id, name: this.name, hp: this.hp, destroyed: this.destroyed
        };
    }
}

module.exports = Player;