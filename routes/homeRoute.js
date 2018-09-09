const express = require('express');
const router = express.Router() ;

//GET ->  une route pour le chemin par defaut / 
router.get('/', (req, res)=>{
    //res.send('chemin root de l\'app');
    // on va utiliser le moteur de template pug
    // on utilise la template index depuis le dossier views , et en set les varible quie existe dans la template pas l'objet json
    res.render('index' , {title:'NodeJs Initialisation' , message: ' NodeJs Initialisation avec view engine Pug'})
});

module.exports = router ;