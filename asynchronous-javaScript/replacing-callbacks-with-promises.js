
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
            resolve(['chambre1' , 'chambre2' , 'chambre3']);
        } , 2000);
    });
}

console.log('Before');
// il faut savoir que la promise stock le resulat ce qui permet de passer le resultat d'une promise a une autre 
// comme un systeme de pipe sur linux 
getImmeuble(1)
    .then(im => { console.log('immeuble ---------',im); return getAppartments(im.id)} )    
        .then(apps => {console.log('appartments --------', apps); return getChambres(apps[0])})
            .then(chambres => {console.log('------ chambre = ', chambres);})
    .catch(err => concole.log('Error => ', err.message));


console.log('After');



