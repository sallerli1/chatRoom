
var util = require("../util"),
    ChatRoom = require("./chatRoom");

function ChatRoomCollection(arr) {
    var chatRooms = new Array();
    this.length = 0;

    this.getRoom = function(index) {
        if (util.isTypeOf(index, "Number")) {
            return chatRooms[index] || false;
        } else if (util.isTypeOf(index, "String")) {
            for (var room of chatRooms) {
                if (room.id === index) {
                    return room;
                }
            }
            return false;
        }
    };

    this.getRooms = function() {
        return chatRooms;
    };

    this.add = function(id) {
        if (chatRooms.push(new ChatRoom(id))) {
            this.length++;
            return true;
        }

        return false;
    };

    this.remove = function(id) {
        for (var room of chatRooms) {
            if (room === id) {
                if (delete room) {
                    return true;
                }
            }
        }

        return false;
    };

    if (util.isTypeOf(arr, Array)) {
        chatRooms = chatRooms.concat(arr);
        this.length = arr.length;
    }
}

exports = module.exports = ChatRoomCollection;