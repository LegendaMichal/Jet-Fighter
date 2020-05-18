const User = require('./user.js');

class UserList {
    constructor(args) {
        this.users = [];
    }

    addUser(newUser) {
        if (this.users.some(user => user.id === newUser.id))
            return;
        console.log("Add user:", newUser);
        this.users.push(newUser);
    }

    removeUser(userId) {
        this.users = this.users.filter(user => user.id !== userId);
    }
}

module.exports = UserList;