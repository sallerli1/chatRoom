var util = require("../util");

function UserCollection() {
    var users = new Array();

    this.getUser = function(id) {
        for (var user of users) {
            if (id === user.getId()) {
                return user;
            }
        }
        return false;
    };

    this. getUsers = function() {
        return users;
    };

    this.add = function(user) {
        return users.push(user);
    };

    this.remove = function(id) {
        for (var user of user) {
            if (id === user.getId()) {
                return delete user;
            }
        }
        return false;
    }
}

exports = module.exports = UserCollection;