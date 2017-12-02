var UserManager = require("./lib/user/userManager"),
    ChatRoomCollection = require("./lib/chatRoom/chatRoomCollection"),
    express = require("express"),
    http = require("http"),
    sio = require("socket.io"),
    path = require("path"),
    fs = require("fs");

function Server() {
    var app = express(),
        httpServer = http.createServer(app),
        sioServer = sio(httpServer);

    app.use(express.static(path.join(__dirname, '../web')));

    var config = loadConfig("../config/config.json");
    var chatRoomCollection = new ChatRoomCollection();
    var userManager = new UserManager(chatRoomCollection);
    
    this.init = function() {
        sioServer.on("connect", function(socket) {
            var user = userManager.createUser(socket);
            userManager.initUser(user);
        });
    };

    this.run = function() {
        httpServer.listen(config['port']);
    }
}

function loadConfig(path) {
   return JSON.parse(fs.readFileSync(path));
}

exports = module.exports = Server;