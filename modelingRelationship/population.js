const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const Author = mongoose.model('Author', new mongoose.Schema({
  name: String,
  bio: String,
  website: String
}));

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  author: {
    type: mongoose.Schema.Types.ObjectId, // c'est l aproche hybride (embarqué la ref de document plus le nom comme un objet auther dans course)
    ref:'Author' // la reference de document ou l'entité,  c'est comme hibernate avec les annotation @oneToMany @manyToOne
  }
}));

async function createAuthor(name, bio, website) { 
  const author = new Author({
    name, 
    bio, 
    website 
  });

  const result = await author.save();
  console.log(result);
}

async function createCourse(name, author) {
  const course = new Course({
    name, 
    author
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() { 
  const courses = await Course
    .find()
    .populate('author' , 'name bio -_id') // pour recuper les author qu'ils une reference avec course , -_id exclure le id , si on a une autre reference avec un autre type de document on peut le recuperer dans course par .populate('nomSchema') encore
    .select('name');
  console.log(courses);
}

// createAuthor('Mario', 'My bio', 'My Website');

// createCourse('Node Course', 'authorId')
//createCourse('Angular Course', '5ba7c7d91518822c041140a1');

listCourses();