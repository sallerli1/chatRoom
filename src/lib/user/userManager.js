var util = require("../util"),
    exceptions = require("../exceptions"),
    User = require("./user");

function UserManager(chatRoomCollection) {
    if (!util.isTypeOf(chatRoomCollection, "ChatRoomCollection")) {
         throw new TypeError();
    }

    this.chatRoomCollection = chatRoomCollection;
}

UserManager.prototype.createUser = function(id, socket) {
    return new User(id, socket);
}

UserManager.prototype.changeId = function(user, id) {
    var oldId = user.getId();

    user.changeId(id);

    user.getSocket().to(user.getRoomId()).emit("id changed", oldId, id);
}

UserManager.prototype.joinChatRoom = function(user, roomId) {
    var socket = user.getSocket(),
        chatRoom = this.chatRoomCollection.getRoom(roomId);

    if ((!chatRoom) || user.getRoomId()) {
        socket.emit("exception", exceptions['ROOM_NOT_EXIST']);
        return false;
    }

    chatRoom.join(user);
    socket.join(roomId);
    user.changeRoom(roomId);
    socket.to(roomId).emit("joined", user.getId());
    return true
}

UserManager.prototype.leaveChatRoom = function(user, roomId) {
    var socket = user.getSocket(),
        chatRoom = this.chatRoomCollection.getRoom(roomId);

    if ((!chatRoom) || !user.getRoomId()) {
        socket.emit("exception", exceptions['ROOM_NOT_EXIST']);
        return false;
    }

    chatRoom.leave(user.getId());
    user.getSocket().leave();
    user.changeRoom(false);
    socket.to(room).emit("left", user.getId());
    return true;

}

UserManager.prototype.changeChatRoom = function(user, roomId) {
    this.leaveChatRoom(user, user.getRoomId());
    this.joinChatRoom(user, roomId);
}

UserManager.prototype.sendMessage = function(user, message) {
    if (!user.getRoomId()) {
        user.getSocket().emit("exception", exceptions['NO_ROOM_JOINED']);
        return;
    }

    user.getSocket().to(user.getRoomId()).emit("message", message);
}

UserManager.prototype.initUser = function(user) {
    if (util.isTypeOf(user, "User")) {
        throw new TypeError();
    }

    var _that = this,
        socket = user.getSocket();

    socket.on("message", function(message) {
        socket.broadcast.to(user.getRoomId()).emit("message", user.getId(), message);
    });

    socket.on("join", function(roomId) {
        _that.joinChatRoom(user, roomId);
    });

    socket.on("leave", function(roomId) {
        _that.leaveChatRoom(user, roomId);
    });

    socket.on("change id", function(id) {
        _that.changeId(user, id);
    });

    socket.on("disconnect", function() {
        _that.leaveChatRoom(user, user.getRoomId());
    });

    socket.emit("change id");
}

exports = module.exports = UserManager;