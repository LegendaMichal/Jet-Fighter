class User {
    constructor(args) {
        this.id = args.id;
    }

    getId() {
        return this.id;
    }
}

module.exports = User;