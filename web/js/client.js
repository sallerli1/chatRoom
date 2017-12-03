

var client = {
    socket: io(),
    id: false,

    sendMessage: function(message) {
        this.socket.emit("message", message);
    },

    joinChatRoom: function(roomId) {
        this.socket.emit("join", roomId);
    },

    leaveChatRoom: function(roomId) {
        this.socket.emit("leave", roomId);
    },

    addChatRoom: function(roomId) {
        this.socket.emit("add room", roomId);
    },

    changeId: function(id) {
        this.socket.emit("change id", id);
    },

    on: this.socket.on,
    emit: this.socket.emit
}
