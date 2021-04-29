

function getCouponCode (length) {
    var possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var code = '';

    for (var i = 0; i < length; i++) code += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));

    return code;

}

module.exports = {getCouponCode}