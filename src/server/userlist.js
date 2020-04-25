const User = require('./user.js');

class UserList {
    constructor(args) {
        this.users = [];
    }

    addUser(userId) {
        if (this.users.includes(userId))
            return;
        console.log("Add user:",userId);
        this.users.push(new User({
            id: userId
        }));
    }

    removeUser(userId) {
        if (this.users.includes(userId))
            this.users.splice(this.users.indexOf(userId), 1);
    }
}

module.exports = UserList;