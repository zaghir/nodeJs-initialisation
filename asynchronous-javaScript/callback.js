
function getImmeuble(id, callback){ // 1- ajouter la reference de la fonction callback dans la signature de la methode getImmeuble qui ascynchrone
    setTimeout( ()=> {
        console.log('Reading Building from database...');
        callback( {id: id , name: 'Monkey'}); // 2- la callback va retourner un objet Immeuble
    } , 2000);
}

function getAppartments(idImmeuble , callback){
    setTimeout(()=>{
        console.log('Recuprer les Apartments...');
        callback(['apartment1' , 'apartment2' , 'apartment3']);
    } , 2000);
}

console.log('Before');
getImmeuble(1 , (immeuble)=>{  // 3- on recupere l'objet retourné par la callback
    console.log('immeuble' , immeuble);

    getAppartments(immeuble.id , (appartments)=>{
        console.log('appartments ' , appartments);
    });
});


console.log('After');



