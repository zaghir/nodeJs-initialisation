const Joi = require('joi');

// on recuper une fonction à partir le package Express
const express = require('express');
const app = express();
// dire à express d'utiser express.json pour recupere le body de request query
app.use(express.json());


let users = [
    { id: 1 , nom: 'nom-1' , prenom: 'prenom-1'},
    { id: 2 , nom: 'nom-2' , prenom: 'prenom-2'},
    { id: 3 , nom: 'nom-3' , prenom: 'prenom-3'},
];
//GET ->  une route pour le chemin par defaut / 
app.get('/', (req, res)=>{
    res.send('chemin root de l\'app');
});

app.get('/api/users' , (req ,res)=>{
    res.send(['Mario', 'Morati' ,'Zaniti']);
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

