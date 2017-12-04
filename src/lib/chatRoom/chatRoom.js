var util = require("../util"),
    UserCollection = require("../user/userCollection"),
    User = require("../user/user");

function ChatRoom(id, userCollection) {
    this.id = id;
    if (!util.isTypeOf(userCollection, UserCollection)) {
        this.userCollection = new UserCollection();
    } else {
        this.userCollection = userCollection;
    }
}

ChatRoom.prototype.getId = function() {
    return this.id;
}

ChatRoom.prototype.getUsers = function() {
    return this.userCollection.getUsers();
}

ChatRoom.prototype.getUser = function(id) {
    return this.userCollection.getUser(id);
}

ChatRoom.prototype.getUserCount = function() {
    return this.userCollection.length;
}

ChatRoom.prototype.join = function(user) {
    if (!util.isTypeOf(user, User)) {
        throw new TypeError();
    }

    return this.userCollection.add(user);
}

ChatRoom.prototype.leave = function(id) {
    return this.userCollection.remove(id);
}

exports = module.exports = ChatRoom;