function isTypeOf(o, type) {
    if (Object.prototype.toString.call(type) === "[object String]") {
        return Object.prototype.toString.call(o) ==="[object "+type+"]";
    } else {
        return o instanceof type;
    }
}

function inheritPrototype(sub, sup) {
    var prototype = Object.create(sup.prototype);
    prototype.constructor = sub;
    sub.prototype = prototype;
}

exports.isTypeOf = isTypeOf;
exports.inheritPrototype = inheritPrototype;