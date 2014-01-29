var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;
 
var usersSchema = new Schema({
    email: { type: String },
    password: String,
    salt: String,   
    first_name: String,
    surname: String,
    house: String,
    postcode: String,
    user_type: Number,
	homephone: String,
	mobphone: String,
	newletter: Boolean,
    creation: { type: Date, default: Date.now }
  });
 
exports.User = mongoose.model( 'user', usersSchema );
console.log('Users Schema Created');

 


