
var util = require("../util"),
    exceptions = require("../exceptions"),
    success = require("../success"),
    User = require("./user"),
    timers = require("timers");

function UserManager(chatRoomCollection) {
    this.chatRoomCollection = chatRoomCollection;
}

UserManager.prototype.createUser = function(id, socket) {
    return new User(id, socket);
}

UserManager.prototype.changeId = function(user, id) {
    var oldId = user.getId();

    user.changeId(id);

    user.getSocket().emit("success", success['CHANGE_ID'], {
        id: id
    });
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
    socket.emit("success", success['JOIN'], {
        roomId: roomId,
        count: chatRoom.getUserCount()
    });
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
    socket.to(roomId).emit("left", user.getId());
    user.getSocket().leave(roomId);
    user.changeRoom(false);
    socket.emit("success", success['LEAVE'], {
        roomId: roomId
    });

    return true;

}

UserManager.prototype.changeChatRoom = function(user, roomId) {
    this.leaveChatRoom(user, user.getRoomId());
    this.joinChatRoom(user, roomId);
}

UserManager.prototype.addChatRoom = function(user, roomId) {
    this.chatRoomCollection.add(roomId);
    user.getSocket().broadcast.emit("room added", roomId);
    user.getSocket().emit("success", success['ADD_ROOM'], {
        roomId: roomId
    });
}

UserManager.prototype.sendMessage = function(user, message) {
    if (!user.getRoomId()) {
        user.getSocket().emit("exception", exceptions['NO_ROOM_JOINED']);
        return;
    }

    user.getSocket().to(user.getRoomId()).emit("message", user.getId(), message, false);
    user.getSocket().emit("message", user.getId(), message, true);
}

UserManager.prototype.initUser = function(user) {
    if (!util.isTypeOf(user, User)) {
        throw new TypeError();
    }

    var _that = this,
        socket = user.getSocket(),
        chatRooms = this.chatRoomCollection.getRooms(),
        roomArr = new Array();

    for (var room of chatRooms) {
        roomArr.push(room.getId());
    }

    socket.on("message", function(message) {
        _that.sendMessage(user, message);
    });

    socket.on("join", function(roomId) {
        _that.joinChatRoom(user, roomId);
    });

    socket.on("leave", function(roomId) {
        _that.leaveChatRoom(user, roomId);
    });

    socket.on("change id", function(id) {
        if (!id) {
            return;
        }
        _that.changeId(user, id);
    });

    socket.on("add room", function(roomId) {
        _that.addChatRoom(user, roomId);
    });

    socket.on("disconnect", function() {
        _that.leaveChatRoom(user, user.getRoomId());
    });

    timers.setTimeout(function() {
        socket.emit("change id");
        socket.emit("rooms", roomArr);
    }, 1000);
    
}

exports = module.exports = UserManager;