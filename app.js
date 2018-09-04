// node  envolope le code js dans la fonction annonyme pour quelle soit executée 

const log = require('./logger');
console.log(log);
log.log('Mon message 123');

// node regarde recupere les dependances dans le kit d'installation ou dans le dossier node_module
// s'il ne les trouve pas il faut lui specifié le chemin dossier en cours  require('./logger');  ou le dossier racine require('../logger'); 
console.log("=================Utilisation de module Os ===============");
const os = require('os');
let totalMemory = os.totalmem();
let freeMemory = os.freemem();
console.log(`Total Memory = ${totalMemory}   Free Memory = ${freeMemory} `);

console.log("=================Utilisation de module Fs ===============");
const fs = require('fs');
const filesSycnrone = fs.readdirSync('./');
console.log('filesSycnrone ==> ' ,filesSycnrone);

fs.readdir('./', function(error, pathLike){
    if(error) {
        console.log('filesAscynrone error => ',error);
    }else{
        console.log('filesAscynrone => ',pathLike);
    }
})

console.log("=================Utilisation de module events ===============");
// on recupre une class
const EventEmitter = require('events');
//console.log(EventEmitter);
// instancier l'objet appartir de la class recuperer de depot nodeJs
const emitter = new EventEmitter();
// enregister premierement un listener qui va ecouter l'evenement 
emitter.on('messageLogged', function(){
    console.log('emitter.on ==> evenement recuperer !!');
});
// envoyer un signal
emitter.emit('messageLogged');

emitter.on('messageSendWithParams', (paramsEvend)=>{
    console.log('messageSendWithParams ==>', paramsEvend)
});
emitter.emit('messageSendWithParams' ,{param1:'pr1' , param2: 'pr2', param3:'pr3'});

console.log('======> utilisation de logger 2');
const Logger2 = require('./logger2');
const logger2 = new Logger2();
// l'ecouteur sur l'evenement envoyer par Logger2
logger2.on('messageLogged2',(params)=>{
    console.log('messageLogged2 ==> ',params);
});
// je declanche un evenement au moment de l 'appel à la methode log du logger2
logger2.log('tester le logger 2 ');

console.log("=================Utilisation de module http ===============");
const http = require('http')
const server = http.createServer((req,res)=>{
    if(req.url ==='/'){
        res.write('Connexion sur le serveur')
        res.end();
    }
    if(req.url ==='/api/courses'){
        res.write(JSON.stringify([1,2,3,4,5,]));
        res.end();
    }
});

server.listen(3000);
console.log('Listening on port 3000...');