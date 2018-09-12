// pour le test node settled-promise.js
// creation d'une promise réglée
// la classe promise a des methode static

// cette promise envoie toujour un erreur , c'est utile pour faire les tests unitaires par exp
// toujour utiliser l'objet Error au lieu d'un simple message , ca permet de recuperer toute la stack d'error
const p = Promise.reject(new Error('Erreur de recuperation'));  
p.catch(err => console.log(err));

const p2 = Promise.resolve({id: 1, nom:'promise2' });
p2
  .then(result => console.log('Result : ' , result))
  .catch(err => console.log(err.message));