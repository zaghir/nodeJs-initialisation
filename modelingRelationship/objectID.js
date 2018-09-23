// composition de l'id generer par le driver de mongo
// _id: 5ba7d0235d02011e3c7f9d18

//  12 bytes
    //  4   bytes: timestamp
    //  3   bytes: machine identifier
    //  2   bytes: process identifier
    //  3   bytes: counter

//  1 byte = 8 bits
//  2 ^ 8  = 256
//  2 ^ 24 = 16M de possibilité

// Driver -> MongoDB
// Il faut savoir que c'est le driver qui genere le id du document 
// et pas MongoDB serveur , chaque driver genere le id à partire de
//   - la date system
//   - l id machine
//   - l id process d'execution
//   - un conteur
// Cette aproche permet avoir plus de performance coté serveur car il ne rend pas la tete a verifié l unicité des clés
// Plusieurs drivers peuvent se connecter sur le meme serveur MongoDB

const mongoose = require('mongoose');

const id  = mongoose.Types.ObjectId();
console.log('id genrer par le driver ',id );
console.log('1ere 4 bytes d id (timestamp)', id.getTimestamp());
console.log('test de validé de l id', mongoose.Types.ObjectId.isValid('abcd123'));