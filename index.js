// module pour debug application 
// ('app:startup')  ou ('app:db')  ===> veut dire le namespace ou le debugger sera utiliser
const startupDebugger =  require('debug')('app:startup');
const dbDebugger =  require('debug')('app:db');
// module pour la configuration des varibles de l'application qui seront externaliser
const config = require('config');
// middeleware morgan pour logger les requetes http Request
const morgan = require('morgan');
// middeleware helmet pour la partie sercurity
const helmet = require('helmet'); 
// middleware joi pour la validation des données 
const Joi = require('joi');
// on recuper une fonction à partir le package Express
const express = require('express');

// les service Rest pour Users
const usersRoute = require('./routes/users');
const homeRoute = require('./routes/homeRoute');

// middleware 
const logger = require('./middleware/logger');
const app = express();
// dire à express d'utiser express.json pour recupere le body de request query
app.use(express.json());

// pour recuperer un pload encoder sous la forme  key=value&key=value dans le body de la requete 
// on utilise le middleware de express ==>  express.urlencoded()  , le cas d'envoie de fomulaire de données 
app.use(express.urlencoded({extended: true})); // req.body   {extend: true} ==> objet de configuration pour dire au middleware de supporer les objet json complex

// middleware static pour definir le dossier ou les fichiers static comme js css seront deposer 
// url de test pour la partie static --> http://localhost:3000/readme.txt
app.use(express.static('public'));

// middleware pour la partie security 
app.use(helmet());

// dire a express chaque requet pour la resource users , en la route vers usersRoute pour gerer la demande
app.use('/api/users' , usersRoute);
app.use('/' , homeRoute);

// Template View
// le but ce n'est pas de creer les page html car il y a les framwork comme angular qui font ca tres bien 
// il y a plusieurs framework pour cote node pour generer le code html , il y a pug, mustash , ejs
// on va utiliser bug pour cette démo
// on va dire a express de set le moteur de template avec pug
app.set('view engine' , 'pug');
// definir le dossier ou se trouve les template pug
app.set('views' ,'./views');

// Environements   dev , prod   
// NODE_ENV : undefined         par defaut node demare ave un environement de dev
// app : development
// pour setter la variable de l'environement node , dans windows ==>set NODE_ENV=production , dans linux ==>export NODE_ENV=production
console.log(`NODE_ENV : ${process.env.NODE_ENV}`);
console.log(`app : ${app.get('env')}`);

// configuration 
// il faut creer les fichiers de configuration dans le dossier config
// - development.json                   :  pour le dev 
// - production.json                    :  pour la prod  
// - default.json                       :  par defaut   
// - custom-environment-variables.json  :  pour les variable extern recuprer depuis un depot des clés comme XLdeploy avec les password des connexion serveurs
// pour tester dans la CLI on set l'environment ==> export NODE_ENV=development 
// set le mot de pass 123456 ==> export app_password=123456
console.log("Application Name "+config.get("name"));
console.log("Mail Server "+config.get("mail.host"));
console.log("Mail Password "+config.get("mail.password"));

// middleware morgan 
// test url --> http://localhost:3000/api/users
// result de test  GET /api/users 200 123 - 3.701 ms
// on va activer la fonction de log http que en mode development
if(app.get('env')==='development'){
    app.use(morgan('tiny'));
    //console.log('Morgan enabled...');
    // on utilise le startupDebugger
    startupDebugger("Morgan enabled...");    
}


//DB word pour les DAO ...
// pour les tests dans le CLI on set la variable DEBUG=namespace
// => export DEBUG=app:startup
// => export DEBUG=app:db 
// => export DEBUG=   pour ne pas logger
// => export DEBUG=app:startup,app:db     utiliser les deux log des deux namespace
// => export DEBUG=app:*     log tous avec le joket *
dbDebugger("Connection to the database ...");  // equivalent à console.log() mais avec plus de details

app.use(logger);

// creation d'un middleware customisé dans Express  Authentificating 
app.use(function(req, res , next){
    //toutes les requetes passent pas ce middleware
    console.log("authentificating ... ");
    // il ne faut pas oublier la methode next(); pour que le thread execute le prochain traitement
    // si non la page sera bloqué tant que en fait pas appel à la methode next();
    next();
});

// on parametre le serveur http avec le port d'ecoute 3000
//app.listen(3000 , ()=> console.log('Ecouter sur le port 3000 ... '));

// si on est dans un projet on aura plusieurs environement  dev test prod
// le port utilisé ici a une valeur fix et il faut le parametrer

const port = process.env.PORT || 3000 ;  // si on ne trouve pas de valeur on utilise 3000 par defaut
app.listen(port , ()=> console.log(`Ecouter sur le port ${port} ... `));
// pour lancer il faut dans :
// - dans window console setter le port ==>  set PORT= 5000
// - dans window console setter le port ==>  export PORT= 5000
// demarer le serveur  par nodemon index.js

