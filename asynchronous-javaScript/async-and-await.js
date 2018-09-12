// pour tester node async-and-await.ja
function getImmeuble(id){
    return new Promise((resolve, reject)=>{
        setTimeout( ()=> {
            console.log('Reading Building from database...');
            resolve( {id: id , name: 'Monkey'}); 
        } , 2000);
    }); 
    
}

function getAppartments(idImmeuble){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            console.log('Recuprer les Apartments...');
            resolve(['apartment1' , 'apartment2' , 'apartment3']);
        } , 2000);
    });
}

function getChambres(idApptement){
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            console.log('Recuprer les chambres...');
            //resolve(['chambre1' , 'chambre2' , 'chambre3']);
            // simuller une erreur
            reject(new Error('impossible de recupere les données des chambres ...'));
        } , 2000);
    });
}

console.log('Before');

// dans le fichier replacing-callbacks-with-promise on a utilisé les promises Javascript
// getImmeuble(1)
//      .then(im => { console.log('immeuble ---------',im); return getAppartments(im.id)} )    
//          .then(apps => {console.log('appartments --------', apps); return getChambres(apps[0])})
//              .then(chambres => {console.log('------ chambre = ', chambres);})
//      .catch(err => concole.log('Error => ', err.message));

// dans notre cas on va utiliser les nouvelles fonction async et await
// on ecrie le code comme c'est du scyncrone avec l'ajout de decorateur await sur chaque methode ascycrone
// le compilateur libere le thread pour faut un autre traitement chaque fois il trouve await , 
// c'est la syntaxe qui change pour quelle soit plus simple comme en mode asynchrone mais c'est toujous le compilateur qui fonctionne en mode asynchrone
// et il faut utilise la fonction await dans une fonction décoré aussi avec le mot ascy
// cette aproche et introduite par Microsoft , et le comilateur de javascript transforme async et await en Promise avec then pour recuprer le resulat
// 
async function afficherChambres() {
    try{
        const immeuble = await getImmeuble(1);
        const apps = await getAppartments(immeuble.id);
        const champres = await getChambres(apps[0]);
        console.log('chambres => ', champres);
    }catch(err){
        console.log('Error => ', err.message);
    }
    
};
// la methode decorée par async ne retour pas de valeur elle de type void
afficherChambres();

console.log('After');



