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
    
    var inited = false,
        isRunning = false;

    app.use(express.static(path.join(__dirname, '../web')));

    var config = loadConfig(path.join(__dirname, "../config/config.json"));
    var chatRoomCollection = new ChatRoomCollection();
    var userManager = new UserManager(chatRoomCollection);
    
    this.init = function() {
        if (inited) {
            return;
        }

        sioServer.on("connect", function(socket) {
            var user = userManager.createUser(socket);
            userManager.initUser(user);
        });
        inited = true;
    };

    this.run = function() {
        if (isRunning) {
            return;
        }

        httpServer.listen(config['port']);
        isRunning = true;
    }
}

function loadConfig(path) {
   return JSON.parse(fs.readFileSync(path));
}

exports = module.exports = (() => {
    let server = null;
    return function () {
        if (server) {
            return server;
        }

        server = new Server();
        return server;
    }
})();