var mongoose = require("mongoose");

mongoose.connect(process.env.MONGOLAB_URI || 'localhost');

var userSchema = mongoose.Schema({
	'id' : String,
	'name' : String,
	'first_name' : String,
	'last_name' : String,
	'link' : String,
	'username' : String,
	'hometown' : String,
	'location' : String, 
	'quotes' : String,
	'gender' : String,
	'email' : String,
	'imglink' : String,
	'groupID' : String
});

var padSchema = mongoose.Schema({
	'padID' : String, 
	'authors': [],
	'posted' : Boolean
});

var newUser = mongoose.model('User', userSchema);
var newPad = mongoose.model('Pad', padSchema);

exports.User = newUser;
exports.Pad = newPad