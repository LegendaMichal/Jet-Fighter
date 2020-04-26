class Player {
    constructor(args) {
        this.id = args.id;
        this.name = args.name;
    }

    getData() {
        return {
            id: this.id, name: this.name
        };
    }
}

module.exports = Player;