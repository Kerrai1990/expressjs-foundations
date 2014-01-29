
/**
 * Module dependencies.
 */

var express = require('express');

var routes = require('./routes');
var users = require('./routes/users');
var reports = require('./routes/reports');
var map = require('./routes/map');

var db = require('./config/database');

var http = require('http');
var path = require('path');

var engine  = require( 'ejs-locals' );

var mongoose = require('mongoose');

//Initialise express
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine( 'ejs', engine );
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.cookieParser());  
app.use(express.session({ 
	secret: 'CHANGEME',
	cookie: { maxAge: 24*60*60*1000 }
}));

app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});

app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


mongoose.connect('mongodb://localhost/DATABASENAME'); 


// development only -- Remove on Production!
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Home 
app.get('/', routes.index);
    app.get('/register', routes.register);
    app.post('/registeruser', routes.registeruser);
	
    app.get('/login', routes.login);
	app.post('/loginuser', routes.loginuser);
    app.get('/logout', routes.logout);
    app.get('/forgot', routes.forgotpass);
	app.get('/controlpanel/:userid', routes.controlpanel);
	app.post('/edituserdetails', routes.edituserdetails);
    
//User Page
app.get('/users', users.index);

//Reports
app.get('/reports', reports.index);

//Crime Map
app.get('/map', map.index);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
