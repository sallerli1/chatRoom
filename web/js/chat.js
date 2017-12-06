

var socket = io();

var client = {
    socket: socket,
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

var chat = {
    client: client,
    chatRooms: new Array(),
    roomId: false,

    join: function(roomIdNow, roomIdPre) {
        client.leaveChatRoom(roomIdPre)
        client.joinChatRoom(roomIdNow);
    },

    addChatRoom: function(roomId) {
        client.addChatRoom(roomId);
    },

    changeId: function(id) {
        client.changeId(id);
    },

    sendMessage: function(message) {
        client.sendMessage(message);
    },

    initChatApp: function(app) {
        var _that = this,
            input = app.querySelector("#editer"),
            send = app.querySelector("#button"),
            display = app.querySelector(".mesDisplay"),
            add = app.querySelector(".rooms .add"),
            rooms = app.querySelectorAll(".rooms .room");

        send.addEventListener("click", function (event) {
            var message = input.value;
            _that.sendMessage(message);
            input.value = "";
        }, false);

        add.addEventListener("click", function (event) {
            _that.addChatRoom(prompt("what's the name of the new chat room ?"));
        }, false);
    },

    initClient: function(app) {
        var _that = this,
            input = app.querySelector("#editer"),
            send = app.querySelector("#button"),
            display = app.querySelector(".mesDisplay"),
            add = app.querySelector(".rooms .add"),
            rooms = app.querySelector(".rooms");

        this.client.socket.on("message", function (id, message, self) {
            _that.view.appendMessage(display, id, message, self);
        });

        this.client.socket.on("rooms", function (roomArr) {

            rooms.parentElement.appendChild(add)
            _that.view.empty(rooms);
            rooms.appendChild(add);

            for (var roomId of roomArr) {
                _that.view.addChatRoom(rooms, roomId);
            }
        });

        this.client.socket.on("joined", function (id) {
            _that.view.appendInfo(display, id + " joined chat room");
        });

        this.client.socket.on("left", function (id) {
            _that.view.appendInfo(display, id + " left chat room");
        });

        this.client.socket.on("id changed", function (oldId, id) {
            _that.view.appendInfo(display, oldId + " is now called " + id);
        });

        this.client.socket.on("change id", function () {
            _that.changeId(prompt("what's you nick name ?"));
        });

        this.client.socket.on("room added", function (roomId) {
            _that.view.addChatRoom(rooms, roomId);
        });

        this.client.socket.on("success", function (success, response) {
            switch (success.code) {
                case _that.config.success['JOIN']:
                    _that.view.joinChatRoom(display, rooms, response['roomId'], response['count']);
                    _that.roomId = response['roomId'];
                    break;

                case _that.config.success['CHANGE_ID']:
                    _that.client.id = response['id'];
                    break;

                case _that.config.success['ADD_ROOM']:
                    _that.view.addChatRoom(rooms, response['roomId']);
                    break;

                default:
                    break;
            }
        });
    },

    view: {

        addChatRoom: function (rooms, id) {
            var room = document.createElement("li"),
                add = rooms.lastElementChild;

            room.classList.add("room");
            room.dataset.room = id;
            room.innerHTML = "<span>" + id + "</span>";

            room.addEventListener("click", function (event) {
                chat.join(room.dataset.room, chat.roomId);
            }, false);

            rooms.appendChild(room);
            rooms.appendChild(add);
        },

        joinChatRoom: function (mesDisplay, rooms, roomId, num) {
            var selected = rooms.querySelector(".selected"),
                toSelect = rooms.querySelector("li[data-room = '" + roomId + "']");

            if (selected === toSelect) {
                return;
            }

            if (selected instanceof HTMLLIElement) {
                selected.classList.remove("selected");
            }
            
            toSelect.classList.add("selected");
            var info = "There are " + num + "users in this chat room";
            this.empty(mesDisplay);
            this.appendInfo(mesDisplay, info);
        },

        appendMessage: function (mesDisplay, id, message, self) {
            var messageBlock = document.createElement("div");
            messageBlock.classList.add("messageBlock");
            messageBlock.innerHTML = ['<div class="userName">',
                '<span>',
                id,
                '</span>',
                '</div>',
                '<p class="message">',
                message,
                '</p>'].join("");

            if (self) {
                messageBlock.classList.add("self");
            }

            mesDisplay.appendChild(messageBlock);
        },

        appendInfo: function (mesDisplay, info) {
            var message = document.createElement("span");
            message.style.alignSelf = "center";
            message.innerHTML = info;
            mesDisplay.appendChild(message);
        },

        empty: function (element) {
            var child;
            while (child = element.lastChild) {
                element.removeChild(child);
            }
        },
    },

    config: {
        success: {
            CHANGE_ID: 1,
            JOIN: 2,
            LEAVE: 3,
            ADD_ROOM: 4
        }
    }
}


window.onload = function() {
    var app = document.querySelector("#chat-room");
    chat.initClient(app);
    chat.initChatApp(app);
}
