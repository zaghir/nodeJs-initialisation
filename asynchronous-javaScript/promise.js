// pour tester => node promise.js

// promise c'est object qui tient le resulat d'une operation asynchrone
// quand on cree la promise elle est statut d'attente  
// [pending] --------> async operation -------> fulfilled or resulat  la promise renvoie une valeur
// [pending] --------> async operation -------> rejected  la promise renvoie une erreur

// creer la promise
const promise  = new Promise((resolve, reject)=>{    
    setTimeout(()=>{
        // si le traitement est bien executé 
        // resolve('traitement Ok'); // pending => resolved , or fulfilled
        
        // si le traitement a echoué 
        reject(new Error('traitment Ko!'));  // pending  => rejected
    }, 2000);
});

// consomé le retour de la promise

promise
    .then( resultat =>{
        console.log('Resulat : ' ,resultat);
    })
    .catch(error=>{
        console.log('Error : ' , error.message);
    })