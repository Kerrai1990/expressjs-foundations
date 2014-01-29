var db = require('../config/database.js');
var bcrypt = require('bcrypt-nodejs');
var md5 = require('MD5');

/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('home/index', { title: 'TITLE' });	
};


/* Register Page */
exports.register = function(req, res){
  res.render('home/register', { title: 'Register' });
};


/* Register User */
exports.registeruser = function(req, res){

	SALT_WORK_FACTOR = Date.now();
	var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
	var hashedPass = bcrypt.hashSync(req.body.password, salt);
	
  	var newUser = new db.User({
	    email: req.body.email,
	    password: hashedPass,
	    salt: salt,
	    first_name: req.body.fname,
	    surname: req.body.sname,
	    house: req.body.house,
	    postcode: req.body.postcode,
	    user_type: '1'
	});
	
	newUser.save(function(err, user) {
    if (err) { 
		console.error(err); 
		res.send('Error'); 
		return; 
	} else {
		console.log('User Created');
		res.redirect('/login');
	}
  });
}


/* Login Page */
exports.login = function(req, res){
  res.render('home/login', { title: 'Login Page' });
};


/* Login User */
exports.loginuser = function loginuser(req, res){
	
	userEmail = req.body.email;
	userPass = req.body.password;
	
	// Find single user
	db.User.findOne({ email : userEmail }, function(err, user) {
	  if (err) return console.error(err);
	  
	  var userName = user.first_name;
	  var usersHashedPass = user.password;
	  var userSalt = user.salt;
	  	  
	  var hashedPass = bcrypt.hashSync(userPass, userSalt);
	  
	  if (hashedPass === usersHashedPass) {
		  
		  req.session.gravatar = md5(userEmail);
		  req.session.userid = user._id;
		  req.session.username = userName;
		  req.session.useremail = userEmail;
		  res.redirect('/');
	  } else {
		  res.redirect('/login');
	  }
	});
}


/* Logout User */
exports.logout = function(req, res) {
	// clear out the session
	req.session.destroy();
	res.redirect('/login');
};

exports.forgotpass = function(req, res) {};


/* Control Panel */
exports.controlpanel = function(req, res) {
	//Get url id parameter
	var userid = req.params.userid;
	
	db.User.findOne( { _id : userid } , function(err, user) {
		if (err) return console.error(err);
		
		var userFName = user.first_name;
		var userSName = user.surname;
		var userEmail = user.email;
		var houseNo = user.house;
		var postCode = user.postcode;
		var userType = user.usertype;
		var homeNo = user.homephone;
		var mobNo = user.mobphone;
		
		res.render('home/controlpanel', { 
			title: 'Control Panel', 
			userid: userid, 
			fname: userFName, 
			sname : userSName, 
			email : userEmail, 
			house : houseNo, 
			postcode : postCode, 
			usertype : userType, 
			homeno: homeNo, 
			mobno : mobNo 
		});	
	})
}


/* Edit Details User */
exports.edituserdetails = function edituserdetails(req, res){
	
	userid = req.body.userid;
	
	db.User.findOne( { _id : userid } , function(err, user) {
		if (err) return console.error(err);
		
		if (user.first_name != req.body.fname) user.first_name = req.body.fname;
		if (user.surname != req.body.sname) user.surname = req.body.sname;
		
		if (user.house != req.body.house) user.house = req.body.house;
		if (user.postcode != req.body.postcode) user.postcode = req.body.postcode;
		
		if (user.homephone != req.body.house) user.homephone = req.body.homephone;
		if (user.mobphone != req.body.mobphone) user.mobphone = req.body.mobphone;
		
		
		if (req.body.password != '' && req.body.passwordnew != '' && req.body.confirmpasswordnew != '') {
		
			var hashedPass = bcrypt.hashSync(req.body.password, user.salt);
			
			if (hashedPass == user.password) { 			
				var newHashedPass = bcrypt.hashSync(req.body.confirmpasswordnew, user.salt);
				user.password = newHashedPass;
			} else {
				console.log('Incorrect Password');
			}
		} else {
			console.log('new and/or confirm boxe(s) are empty')
		}
		
		user.save(function(err) {
			if (err) console.error(err);
			
			res.redirect('/controlpanel/' + userid);
		});
	});
}












