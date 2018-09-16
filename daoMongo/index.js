// pour faire le test ==> node index.js
const mongoose =require('mongoose');

// connection au serveur mongo à la base baTestUn   
// si la base n'existe pas elle sera creer 
// la methode connect retour une promese  
mongoose.connect('mongodb://localhost/baseTestUn')
    .then(()=>{
        // c'est mieux d'utiliser logger que console.log
        console.log('Connected to MongoDB...')
    })
    .catch(err => {console.log('Could not connect to MongoDB..' , err)});


/** creation de schema  --------------------
 dans les SGBR             NoSQL
          Tables           Schemas
          rows             documents
 les schemas sont des propriétes propres à mongoose pas à MongoDB ,
 elles definissent la structure le type et les proprietés de document qui va etre enregistrer
 le schema accept les types suivants : [ String , Number , Date , Buffer , Boolean , ObjectId et primar key , Array]
 */
const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    date: {type: Date ,default: Date.now},
    isPublished: Boolean
});

/** creation de schema  --------------------
*  mongoose creer une Class de type model pour le schema course(Table Course)
*  le cablage entre le model et le schema dans mongo ce fait par mongoose par le nom 'Course'
* le model founi les methode pour save update delete get pour un schema donnée
*/
const CourseModel = mongoose.model('Course', courseSchema);
/**
* dans le mode relationnel on a besoin de 3 table pour stocker le cour , dans nosql on a besoin seulement d'un document course
* c'est pour cette raison le nosql sont des schema less( des tables sans etats)
* on a pas ajouté la date car mongo l'ajout automatiquement au moment de l'ajout
*
* Pour recapituler il faut creer un schema(Table)
* compiler le schema avec la methode model()  pour fournier le model
* creer l'objet model ex: course et faire les operation CRUD habituel
*
* la methode save() retour une promise , on utilise les syntaxe de JS6 pour recupere le resultat des methode asynchrone
*/

async function saveCourse(){
    const course = new CourseModel({
        name: 'Angular Course',
        author: 'YZR',
        tags:['angular', 'front'],
        isPublished: true
    });

    const result = await course.save();
    console.log('resulat de save course ',result);
    /*
        mongo ajout toujour un _id => id unique
      resulat de save course  
      {
          tags: [ 'angular', 'front' ],
          _id: 5b9e6c914fb68a0e6c125b7a,
          name: 'Angular Course',
          author: 'YZR',
          isPublished: true,
          date: 2018-09-16T14:45:37.358Z,
          __v: 0 }
     */
}
// on commante cette methode car on va tester get update delete ...
// saveCourse();

async function getCourses(){
    // la method find retour un documentQueryObject d'ou on peut appliquer des filter complexe
    // sans filter
    //const courses = await CourseModel.find();
    /*
        criteria de recherche
        .find(object)  => on veut trouver les courses avec le author ='YZY' et isPublished = true  
        .limit(n) => limiter le nombre de resultat retourner à 10 documents
        .sort(objetc) => tri des donnée avec les name en ordre ascending = 1 descending = -1
        .select(objet) => dans la recherche recuperer seulement le name et tags mais pas les autres propriétés
     */
    const courses = await CourseModel
        .find({author:'YZR' , isPublished: true})
        .limit(10)
        .sort({name: 1})
        .select({name:1 , tags: 1});
    console.log('lists courses :',courses);

    /*
        logical comparison
        eq  (equal)
        ne  (not equal)
        gt  (greater than)
        gte (greater than or equal)
        lt  (less than)
        lte (less than or equal)
        in 
        nin (not in)
        dans javascript si on compare avec une valeur on utilise toujour l'egalité 
        on ne peut pas utilise la comparaison superieur ou infieur à la valeur , 
        mais pour tester avec > < >= <= on on passe un objet de comparaison avec $operateur => $gt , $lt...

        const courses = await CourseModel
            //.find({author:'YZR' , isPublished: true})
            //.find(prise: 10 )   // comparaison avec ==
            //.find(prise: {$gt: 10 , $lt: 2} )   // comparaison avec >10 et <2
            //.find(prise: {$in: [2, 4, 6] )   // comparaison avec les valeurs limités à [2, 4, 6]
            .limit(10)
            .sort({name: 1})
            .select({name:1 , tags: 1});
        console.log('lists courses :',courses);
     */

     /*
        logical  expresion 
        or 
        and 
        !!!!  il faut savoir qu'il y a toujour un systeme de pipe entre les differents filter
        filter1 traite et envoie les donneés au filter2 , filter2 traite et envoie les donneés au filter3 ....
        or(array[{filter} , {filter} , {filter} ])  l'operation or a besoin d'un tableau avec plusieurs filters comme valeur
        and(array[{filter} , {filter} , {filter} ])
        on peut eclater le filter passer à find() dans le filter operator or ou and ou  or et and    
        const courses = await CourseModel
            //.find({author:'YZR' , isPublished: true})
            .find()   // on suprime le filter dans find()
            .or([{author: 'YZR'},{isPublished: true}])     // recuperer les courses avec author = 'YZR' ou  isPublished = true
            .and()  // definir un autre filter
            .limit(10)
            .sort({name: 1})
            .select({name:1 , tags: 1});
        console.log('lists courses :',courses);
     */

     /*
        Regular Expression   exemple like dans sql
        const courses = await CourseModel
            //.find({author:'YZR' , isPublished: true})

            // starts with YZ     .find({author: /pattern/ })
            .find({author: /^YZ/ })

            // end   with R     .find({author: /pattern/ })   c'est requet et case sensitive sensible à la case pour evite ca ou ajoute i insensitive /pattern/i
            .find({author: /R$/i })

            // Contains word yzr     .find({author: /pattern/i })
            [.*] => peut contenir 0 -> n character  , .*yzr.*  => [0..n]yzr[0..3]
            .find({author: /.*yzr.* /i })

            .limit(10)
            .sort({name: 1})
            .select({name:1 , tags: 1});
        console.log('lists courses :',courses);
      */

      /*
        operateur count() 
        ==> recuperer le nombre de resultat trouver avec le filter 
        const courses = await CourseModel
            .find({author:'YZR' , isPublished: true})
            .limit(10)
            .sort({name: 1})
            .count());
        console.log('lists courses :',courses);
       */

       /*
        pagination 
        ==> dans un appel rest on peut paginner le resulat sur plusieur pages 
            exp de endPoint  : /api/courses?pageNumber=2&pageSize=10

        const pageNumber = 2 ; 
        const pageSize = 10 ;    
        const courses = await CourseModel
            .find({author:'YZR' , isPublished: true})
            .skip((pageNumber-1) * pageSize)
            .limit(pageSize)
            .sort({name: 1})
            .select({name:1 , tags: 1});
        console.log('lists courses :',courses);
       */
}

//getCourses();

async function updateCourseQueryFirst(id){
    // Approach: Query First
    // findById()
    // Modify its properties
    // save()

    const course = await CourseModel.findById(id);
    // si on ne trouve le cours on ne fait rien
    if(!course) return ;
    
    // on set les nouvelles valeurs
    course.isPublished = true ;
    course.author = 'Nouveau Author';
    // il y a une 2 methode pour set les valeur
    // course.set({
    //    isPublished: true ,
    //    author: 'Nouveau Author'
    // });

    const result = await course.save();
    console.log('Update course Id =', id ,' valeus = ',result );
}
// recupere l'id compass
updateCourseQueryFirst('5b9e6de3c3c5040f3c39758d');

async function updateCourseUpdateFirst(id){
    
    // Approach: Update First
    // Update directly 
    // Optionally: get The updated document
    
    // 1 ere  recupere un resultat avec la methode update() 
    const result = await CourseModel.update({_id: id} ,{
        $set: {
            isPublished: false,
            author: 'Ralf Mario'
        }
    });
    console.log('Update course Id =', id ,' valeus = ',result );

    // 2 ere  recupere un objet course avec la methode update() 
    // {new: true} => c'est un parametre pour dire a mongo update course est recupere l'objet avec les nouvelles valeurs
    //const course = await CourseModel.findByIdAndUpdate( id ,{
    //    $set: {
    //        isPublished: false,
    //        author: 'Ralf Mario'
    //    }
    //} ,{new: true});
    console.log('Update course Id =', id ,' valeus = ',course );
}
// recupere l'id compass
updateCourseUpdateFirst('5b9e6d984a473d1e340d3730');


async function removeCourse(id){
    // plusieurs solutions proposé par mongo  
    // const result = await CourseModel.deleteOne({_id: id});  // suprimer un course avec le filter _id = id  , le type de retour c'est un resulat
    // console.log('delete course ', result);

    //const result = await CourseModel.deleteMany({_id: id});  // pour suprimer plusieurs documents ici on peut changer le filter pour suprimer tous les documents isPublished = false
    
    //  le type de retour c'est un objet course qu'est suprimé  
    const course = await CourseModel.findByIdAndRemove({_id: id});
    console.log('delete course ', course);
}

removeCourse('5b9e6d984a473d1e340d3730');