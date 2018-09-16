/* importer les données depuis le fichier .json vers mongoDB
  dans la CLI
  mongoimport --db dataBaseName --collection tableName --file fileName  --jsonArray    (--jsonArray ce flag est utilisé car nous avant un table de données dans le fichier data)  
  mongoimport --db mongo-exercises --collection courses --drop --file exercise-data.json --jsonArray
 */

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mongo-exercises')
    .then(()=>{
        // c'est mieux d'utiliser logger que console.log
        console.log('Connected to MongoDB...')
    })
    .catch(err => {console.log('Could not connect to MongoDB..' , err)});

const courseSchema = new mongoose.Schema({    
    name: String,
    author: String,
    tags: [String],
    date: {type: Date ,default: Date.now},
    isPublished: Boolean,
    price: Number
});    

const CourseModel = mongoose.model('Course' , courseSchema);

// c'est possible d'utiliser les String à la plase de l'objet 
// .sort({name: 1})              => .sort('-name')  pour descending
// .select({name:1, author:1});  => .select('name author')
// on delege la responsabilité de l'affichage à la methode qui appel getCourses()
async function getCourses(){
    return await CourseModel
        .find({isPublished: true , tags: 'backend' })
        .sort({name: 1})
        .select({name: 1, author: 1});
    
}

async function run(){
    const courses = await getCourses();
    console.log('Courses ==> ' , courses);
}

run();

