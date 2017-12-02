
var util = require("../util");

function ChatRoomCollection(arr) {
    var chatRooms = new Array();

    this.getRoom = function(index) {
        if (util.isTypeOf(index, "Number")) {
            return chatRooms[index] || false;
        } else if (util.isTypeOf(index, "String")) {
            for (var room of chatRooms) {
                if (room === index) {
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
        return chatRooms.push(id);
    };

    this.remove = function(id) {
        for (var room of chatRooms) {
            if (room === id) {
                return delete room;
            }
        }
    };

    if (util.isTypeOf(arr, "Array")) {
        chatRooms = chatRooms.concat(arr);
    }
}

exports = module.exports = ChatRoomCollection;