const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  authors: [
    {
      type: authorSchema, 
      required: false
    } 
  ]
}));

async function createCourse(name, authors) {
  const course = new Course({
    name, 
    authors
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() { 
  const courses = await Course.find();
  console.log(courses);
}
async function updateAuthor(courseId){
  // quering first
  // const course = await Course.findById(courseId);
  // course.author.name = 'Mario BOUNTA';
  // on a pas la course.author.save()  pour update l author dans le course , car le couse embarque l author , donc en update tout le course
  // course.save();

  // updating first   
  // const course = await Course.update({_id: courseId} , {
  //  $set: {
  //    'author.name': 'Sofia Boris'
  //  }
  // });

  // delete a property   utiliser la fonction $unset pour suprimer les propriétes qui se trouve dans l'objet de configuration ici en suprier l' author attacher au course
  const course = await Course.update({_id: courseId} , {
    $unset: {
      'author': ''
    }
  });
}

async function addAuthor(courseId , author){
  const course = await Course.findById(courseId) ;
  course.authors.push(author);
  course.save();
}

async function removeAuthor(courseId , authorId){
  const course = await Course.findById(courseId) ;
  const author = course.authors.id(authorId);
  author.remove();
  course.save();
}

// 1- creer le course
// createCourse('MongoDB Course',   new Author({ name: 'Mario' }) );
//createCourse('MongoDB Course', [
//  new Author({ name: 'Mario' }),
//  new Author({ name: 'Maria' })
//]);

// addAuthor ('5ba7d68556bf0e2b64d059c5', new Author({ name: 'Batista' }));

removeAuthor('5ba7d68556bf0e2b64d059c5' , '5ba7d762f6c5d8300c7d32b9');

// 2- update le course
// updateAuthor('5ba7d0235d02011e3c7f9d18');

