var alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
var base = alphabet.length; //62


// converts base 10 integer to base 62 string, returns shortened code that maps to the database
const encode = (num) => {
    let code = '';
    while (num > 0) {
        code += alphabet.charAt(num % base);
        num = Math.floor(num / base);
    }
    return code;
};


// converts base62 string to base10 integer, returns ID from DB

const decode = (code) => {
    let num = 0;
    for (let i = 0; i < code.length; i++) {
        num = num * base + alphabet.indexOf(code.charAt(i));
    }
    return num;
};

module.exports.encode = encode;
module.exports.decode = decode;
