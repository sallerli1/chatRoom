function isTypeOf(o, type) {
    return Object.prototype.toString.call(o) ==="[object "+type+"]";
}

function inheritPrototype(sub, sup) {
    var prototype = Object.create(sup.prototype);
    prototype.constructor = sub;
    sub.prototype = prototype;
}

exports.isTypeOf = isTypeOf;
exports.inheritPrototype = inheritPrototype;