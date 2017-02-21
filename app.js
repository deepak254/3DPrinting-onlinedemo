/**
 * Module dependencies.
 */



//Main module which runs the whole application:: Deepak Tiwari
var express = require('express')
 , routepath = require('./routes/3dRoutes')
  , http = require('http')
  , path = require('path');


//modules imported from node_modules directory.
  //var mongoose = require('mongoose');
var bodyParser=require('body-parser');
var cookieParser=require('cookie-parser');
var methodOverride = require('method-override');
var  passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(cookieParser());
app.use(bodyParser()); 
app.use(bodyParser.json());
app.use(session({ secret: 'mysecretkey11' }));
app.use(flash()); 
app.use(passport.initialize());
app.use(passport.session());
  

app.use(methodOverride('X-HTTP-Method-Override'));
if (process.env.NODE_ENV === 'development') {
	
}



app.use('/',routepath.router);
app.enable('trust proxy');
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
 






var server=http.createServer(app).listen(app.get('port'), function(){

     console.log('Express server listening on port ' + app.get('port'));

});








