
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , Facebook = require('facebook-node-sdk')
  , mailer = require('express-mailer')
  , path = require('path');

var app = express();

mailer.extend(app, {
  from: 'no-reply@olinjs-mashup.com',
  host: 'smtp.gmail.com', // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  auth: {
    user: 'olinjs.mashup@gmail.com',
    pass: 'olinjsmashup12345'
  }
});

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(Facebook.middleware({ appId: '349999828452036', secret: '5b3cf58aa32644d97d83d49ce93aa2a0' }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});



app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', Facebook.loginRequired({scope: [ 'read_friendlists' , 'publish_stream', 'publish_actions']}), routes.index);
app.post('/newPad', routes.newPad);
app.post('/joinPad', routes.joinPad);
app.post('/postFB', routes.postFB);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
