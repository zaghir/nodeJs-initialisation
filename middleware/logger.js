// creation d'un middleware customisé dans Express  Logging
function log(req, res , next){
    //toutes les requetes passent pas ce middleware
    console.log("logging ... ");
    // il ne faut pas oublier la methode next(); pour que le thread execute le prochain traitement
    // si non la page sera bloqué tant que en fait pas appel à la methode next();
    next();
}

module.exports = log ;