
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

async function getCourses(){
    /*  1ere - solution
    return await CourseModel
        .find({isPublished: true , tags: {$in: ['frontend','backend']}})
        .sort('-price')
        .select('name author price');
    */        
   //  2eme - solution  en eclate le filter find et on utilise or()
    return await CourseModel
        .find({isPublished: true })
        .or([{tags: 'frontend'} , {tags: 'backend'}])
        .sort('-price')
        .select('name author price');            
}

async function run(){
    const courses = await getCourses();
    console.log('Courses ==> ' , courses);
}

run();

