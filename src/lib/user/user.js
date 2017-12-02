var util = require("../util");

function User(socket) {
    this.id = "jack";
    this.socket = socket;
    this.roomId = false;
}

User.prototype.getId = function() {
    return this.id;
}

User.prototype.getRoomId = function() {
    return this.roomId;
}

User.prototype.getSocket = function() {
    return this.socket;
}

User.prototype.changeId = function(id) {
    this.id = id;
}

User.prototype.changeRoom = function(roomId) {
    this.roomId = roomId;
}

exports = module.exports = User;