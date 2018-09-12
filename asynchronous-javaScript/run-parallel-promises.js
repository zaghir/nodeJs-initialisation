// pour tester node run-parallel-promises.js

// creer les premises
const p1 = new Promise((resolve, reject)=>{
    setTimeout(() => {
        console.log('Async Operation 1 ...')
        resolve('p1')
    }, 1000);
});

const p2 = new Promise((resolve, reject)=>{
    setTimeout(() => {
        console.log('Async Operation 2 ...')
        resolve('p2');
        //  pour tester le cas d'erreur
        reject(new Error('Probleme dans la promise 2'));
    }, 2000);
});

const p3 = new Promise((resolve, reject)=>{
    setTimeout(() => {
        console.log('Async Operation 3 ...')
        resolve('p3')
    }, 3000);
});

const p4 = new Promise((resolve, reject)=>{
    setTimeout(() => {
        console.log('Async Operation 4 ...')
        resolve('p4')
    }, 4000);
});

// il faut savoir qu'on parle pas d'une programation multi threads , il y a toujours un thread qui tourne 
// le resulat des promises lancer en parallele est recuperé si toutes les promises en fini leur traitements
// si une promise renvoi une erreur alors le resultat recuperer c'est une erreur pas le resultat des promises fini
// le resultat recuperé et sous format d'un tableau , comme valeurs le retour des promises
Promise.all([p1, p2])
    .then((resultat)=>{
        console.log('Resultat groupe de promise' , resultat);
    })
    .catch(err => {console.log(err.message)});

// Promise.race n'attende pas le retour de toutes les promise , des qu'une fini son traitement , Promise.race recuper le resultat, et les autre promise continu leur traitement
// le resultat recupere est une seul valeur pas un tableau comme Promise.all
Promise.race([p3,p4])
    .then((resultat)=>{
        console.log('Promises.race = ' , resultat);
    })
    .catch(err => {console.log(err.message)});