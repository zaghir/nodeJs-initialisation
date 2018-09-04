const EventEmitter = require('events');
// il faut savoir meme si on utilise des signaux , si chaque emetteur est créé dans un fichier 
// ils ne partagent pas le meme scope ou porté meme si on cree deux emitteur 
// pour resoudre le probleme il faut centraliser le traitement dans la meme class et avoir une instance

class Logger2 extends EventEmitter {

    log(message){
        console.log('message Logger2 ==> ', message);
        this.emit('messageLogged2' , {id:'1', message: message});
    }
}

// on va exporter une seule class donc excports represente dans ce fichier seulement une class
module.exports = Logger2 ;