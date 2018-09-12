// notre methode asynchrone illustrer ici par un timer
// c'est une fonction qui ne bloque pas le traitement de thread
// la notion de multi thread ou la concurrence des threads n'existe pas

// console.log('Before');
// setTimeout(() => {
//     console.log('Reading from database...')
// }, 2000);
// console.log('After');

// resulat d'affichage 
// Before
// After
// Reading from database...

function getImmeuble(id){
    setTimeout( ()=> {
        console.log('Reading Building from database...');
        return {id: id , name: 'Monkey'};
    } , 2000);
}

console.log('Before');
const immeuble = getImmeuble(1);
console.log( immeuble);
console.log('After');
// resulat d'affichage 
// Before
// undefined  ==> la getImmeuble() est une methode asynchrone elle ne fournie pas la reponse en temps reel , alors que console.log( immeuble); et une methode scynchone qui affiche le resulat avec la valeur qui n'existe pas encore
// After
// Reading from database...


