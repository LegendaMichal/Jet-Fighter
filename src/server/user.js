class User {
    constructor(args) {
        this.id = args.id;
        this.socketIds = [args.socketId];
        this.name = args.name;
        this.inGame = false;
    }

    getId() {
        return this.id;
    }
}

module.exports = User;