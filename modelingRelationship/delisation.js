//-->  Aproche 1  using References (Normalization)
let author = {
    name:'Mario'
};

let course = {
    id:'1',
    authors:['id1','id2']
}
// dans le monde relatonne on a la notion de l'integrité des données 
// mais dans le mongoDB il n y a pas la notion de relation, si j'ajoute un course avec author 
// qui n'existe pas mongoDB n'aura aucun problème a ajouté ce source

//-->  Aproche 2 using Embedded documents (denormalization)
let course = {
    id:'1',
    author: {
        name: 'Mario'
    }
}


// il faut faire un arbitrage entre query performence et consistency (cohérence)
// dans la 1ere aproche on garantie consistency de la base on change seulement dans une table 
// et toutes les relations recupere le changement mais il y a le probleme de performance 
// car en a besoin de de faire une jointure entre les tables pour recuperer le resultat
// le 2 eme aproche ne grantie pas la constency(la coherence ) car en embarque une entité dans l'autre
// si on veut changer l'entité author par exp il faut changer dnas tous les course ,mais la force 
// de cette aproche est la performance , en faut 1 seule requete pour recuprer le resultat , pas de jointure

// --> 3 eme aproche hybrid

let author = {
    name:'Thomas'
    // others properties
}

let course = {
    author:{
        id:'ref',
        name:'Mario'
    }
}
// dans le schema course on stocke l author comme l'aproche embarqué mais l author dans le schema course
// contien seulement la id reference de l' author comme l'aproche 1 relationnel plus le nom 
