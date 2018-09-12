
function getImmeuble(id, callback){ 
    setTimeout( ()=> {
        console.log('Reading Building from database...');
        callback( {id: id , name: 'Monkey'}); 
    } , 2000);
}

function getAppartments(idImmeuble , callback){
    setTimeout(()=>{
        console.log('Recuprer les Apartments...');
        callback(['apartment1' , 'apartment2' , 'apartment3']);
    } , 2000);
}

function getChambres(idApptement , callback){
    setTimeout(()=>{
        console.log('Recuprer les chambres...');
        callback(['chambre1' , 'chambre2' , 'chambre3']);
    } , 2000);
}

console.log('Before');
getImmeuble(1 , displayImmeubles);  // on utilise la reference de la methode pour faire appel à la fonction
                                    // displayImmeubles c'est une reference de la fonction qui point sur son comportement    
function displayImmeubles(immeuble){
    console.log('immeuble' , immeuble);
    getAppartments(immeuble.id , displayAppartments);
}

function displayAppartments(appartments){
    console.log('appartments ' , appartments);
    getAppartments(appartments[0].id , displayChambres);
}

function displayChambres(chambres){
    console.log('chambres' , chambres);
}

console.log('After');



