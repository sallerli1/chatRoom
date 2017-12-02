var util = require("../util");

function UserManager(userCollection, chatRoomCollection) {
    if (!(util.isTypeOf(userCollection, "UserCollection")
     && util.isTypeOf(chatRoomCollection, "ChatRoomCollection"))) {
         throw TypeError();
     }

     this.userCollection = userCollection;
     this.chatRoomCollection = chatRoomCollection;
}

UserManager.prototype.createUser = function(id, socket) {
    var user = new User(id, socket);
    return this.userCollection.add(user);
}

UserManager.prototype.joinChatRoom = function(user, roomId) {
    var room = this.chatRoomCollection.getRoom(roomId),
        result = true;

    if (!room) {
        result = false
    } else {
        user.getSocket().join(room);
        user.getSocket().to(room).emit("join", user.getId());
    }

    user.changeRoom(room);

    user.getSocket().emit("failedToJoin", result);
}