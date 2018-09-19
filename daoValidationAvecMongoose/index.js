// pour faire le test ==> node index.js
// Le MongoDb ne fait pas de control sur les données manipulées que ce soit pour update save delete 
// contrairement au autres serveurs SGBDR qui applique un control coté serveur , 
// pour valider les données , mongoose propose les methodes de validations , mais aussi il y a JOI qui controle les données utilisées dans les Api Rest
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

// appliquer une verification de données sur le name, il ne faut pas avoir des name vide
const courseSchema = new mongoose.Schema({
    name: {
        type: String ,
        required: true,
        minlength: 5,
        maxlength: 255,
        //match: /pattern/
    },
    category: {
        type: String,
        required: true,
        enum: ['History', 'Math' ,'Programing'],
        lowercase: true,
        //uppercase: true,
        trim: true
    },
    author: String,
    tags: {
        // synchone validator ---------
        // type: Array,
        // validate: {
        //      validator: function(val){
        //          return val && val.lenght> 0;
        //      },
        //      message: 'A course should have al least one tag.'

        // ascync validator ------------
        type: Array,
        validate: {
            isAsync: true,
            validator: function(val , callback){
                setTimeout(()=>{
                    // Do some ascyn work
                    const result = val && val.lenght> 0 ;
                    callback(result);
                }, 3000);
                  
              },
              message: 'A course should have al least one tag.'
        }
    },
    date: {type: Date ,default: Date.now},
    isPublished: Boolean,
    price: {
        type: Number,
        required: function(){ 
            // tester si la valeur de isPublished === true alors le price est obligaoire
            return this.isPublished;
        },
        min: 10,
        max: 5000,
        get: (val) => Math.round(val),  // customisé le get de price avec un round des valeur decilmal ==> get(15.8) = 16 
        set: (val) => Math.round(val)   // customisé le set de price avec un round des valeur decilmal ==> set(15.8) = 16  enregistrer dans le document mongo
    }
});

const CourseModel = mongoose.model('Course', courseSchema);

async function createCourse(){
    
    const course = new CourseModel({
        //name: 'Angular Course',
        category: 'MATH',
        author: 'YZR',
        tags: null,
        isPublished: true,
        price: 15.8
    });

    try{
        // il y a deux maniere pour gerer les exception , soit de les gerer dans le block try catch
        // soit de les gerer dans la fonction validate() du model , ici on va utiliser la premiere methode
        // course.validate((err)=>{
        //   if(err){
        //        console.log('err ---->' , err.message);
        //     }  
        //     
        // });
        const result = await course.save();
        console.log('resulat de save course ',result);   
    }catch(ex){
        // si on log err on recupere le message d'erreur plus la stask des erreurs
        console.log('Erreur sur la creation de course du ==>');
        // dans ex.errors il y a tous les type d'erreurs du model course => ex.errors.price   ex.errors.name ...
        for(field in ex.errors){
            // si on log  ex.errors[field] on recupere la stack trace des erreurs 
            // chaque erreur c'est un objet avec les propriété comme 
            // { message: kind: 'min', path: 'price', value: 9, name: 'ValidatorError',  message: 'Path `price` (9) is less than minimum allowed value (10).',}             
            // dans notre cas on log que le message 
            console.log(ex.errors[field].message);
        }
    }
    
}

createCourse();