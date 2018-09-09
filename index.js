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
// middleware 
const logger = require('./logger');
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

let users = [
    { id: 1 , nom: 'nom-1' , prenom: 'Mario'},
    { id: 2 , nom: 'nom-2' , prenom: 'Morati'},
    { id: 3 , nom: 'nom-3' , prenom: 'Zaniti'},
];
//GET ->  une route pour le chemin par defaut / 
app.get('/', (req, res)=>{
    //res.send('chemin root de l\'app');
    // on va utiliser le moteur de template pug
    // on utilise la template index depuis le dossier views , et en set les varible quie existe dans la template pas l'objet json
    res.render('index' , {title:'NodeJs Initialisation' , message: ' NodeJs Initialisation avec view engine Pug'})
});

app.get('/api/users' , (req ,res)=>{
    res.send(users);
});

//GET -> http://localhost:5000/api/users/zaghir/toto
app.get('/api/users/:firstname/:lastname' , (req ,res)=>{
    res.send(req.params);    
    // res.send(req.query); // ==> pour recuper les params apres "?"  sur format clé valeur 
});

//GET -> http://localhost:5000/api/users/1
app.get('/api/users/:id' , (req ,res)=>{
    const user = users.find((u)=>{ return u.id=== parseInt(req.params.id)});
    if(!user){
        res.status(404).send('utilisateur non trouvé. ');
        return ;
    }
    res.send(user);    
});

//POST http://localhost:5000/api/users
app.post('/api/users' , (req, res)=>{
    // ne jamais faire confiance au données envoyé pas l'utilisateur
    // un fait une validation des données en entrée
    // if(!req.body.nom || req.body.nom <2){
    //     //error 400 bad request
    //     res.status(400).send('nom est obligatoire et doit etre superieur a 2');
    //     return;
    // } 

    // utilisation de Joi pour la validation 
    // creation de schema de validation avec les noms des champs a validé
    const schema = {
        nom: Joi.string().min(3).required()
    }
    const resultvalidation = Joi.validate(req.body , schema);

    if(resultvalidation.error){
        //error 400 bad request
        //res.status(400).send('nom est obligatoire et doit etre superieur a 2');
        res.status(400).send(resultvalidation.error.details[0].message);
        return;
    }       
    
    const user = {
        id: users.length + 1 ,
        name: req.body.nom
    }
    // pour utiliser la methode post il faut utiliser le midelware express.json , il embarque bodyparser
    users.push(user);
    res.send(user);
});

//PUT http://localhost:5000/api/users/:id
app.put('/api/users/:id',(req, res)=>{
    // rechercher le user
    // s'il n'existe pas envoyer l'error 404
    console.log("PUT => " , req.params.id);
    const user = users.find((u)=>{ return u.id=== parseInt(req.params.id)});
    // on a mit return pour ne pas continué le traitement
    if(!user)  return res.status(404).send('utilisateur non trouvé. ')
        
    // on peut recuperer l'erreur du soit pas  resultat.error
    //const result = validateUser(req.body) ; 
    // soit par la notion de object destructuring (L'affectation par décomposition) , du JS6  
    //qui permet d'extraire (unpack en anglais) des données d'un tableau ou d'un objet grâce à une syntaxe dont la forme ressemble à la structure du tableau ou de l'objet.
    // on sait que dans l'objet retourné par fn => validateUser  il y la propriété value et error  donc on l'extrait
    const {error} = validateUser(req.body) ; // ==> equivalent à result.error
    if(error){
        //error 400 bad request
        //res.status(400).send('nom est obligatoire et doit etre superieur a 2');
        res.status(400).send(error.details[0].message);
        return;
    }
    
    // update User
    user.nom = req.body.nom ;
    // renvoyer les mise a jours de user
   res.send(user);

});

function validateUser(user){
    //Validation   on factorise le traitement de validation dans cette methode
    //si n'est pas validé , envoyé l'error 400
    const schema = {
        nom: Joi.string().min(3).required()
    }
    // delegé à Joi la validation des des données avec le schema configurée et en retour l'objet     
    return Joi.validate(user, schema);
}

//DELETE http://localhost:5000/api/users/:id
app.delete('/api/users/:id',(req, res)=>{
    // rechercher le user
    // s'il n'existe pas envoyer l'error 404
    console.log("Delete => " , req.params.id);
    const user = users.find((u)=>{ return u.id=== parseInt(req.params.id)});
    if(!user){
        res.status(404).send('utilisateur non trouvé. ');
        return;
    }
    const index = users.indexOf(user);
    users.slice(index, 1);
    res.send(user);
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

