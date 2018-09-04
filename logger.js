
// Module wrapper function
// node execute les fonction anonyme 
//(function (exports, require, module, __filename, __dirname){
//console.log(module);

console.log("__filename => " , __filename);
console.log("__dirname =>" , __dirname);
    var url = "http://localhost/test";

    function log(message){
        console.log(message);
    }

    module.exports.endPoint = url ;
    module.exports.log = log ;
//});

