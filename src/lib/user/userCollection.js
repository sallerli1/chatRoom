var util = require("../util");

function UserCollection(arr) {
    var users = new Array();
    this.length = 0;

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
        if (users.push(user)) {
            this.length++;
            return true;
        }

        return false;
    };

    this.remove = function(id) {
        for (var user of user) {
            if (id === user.getId()) {
                if (delete user) {
                    this.length--;
                    return true;
                }
            }
        }
        return false;
    }

    if (util.isTypeOf(arr, Array)) {
        users = users.concat(arr);
        this.length = arr.length;
    }
}

exports = module.exports = UserCollection;