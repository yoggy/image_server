CV = require('opencv')

Mongolian = require('mongolian');
ObjectId = Mongolian.ObjectId;
var server = new Mongolian("mongo://localhost:27017");
var db = server.db('image_db');
Image = db.collection('image');

var express = require('express')
  , image = require('./routes/image')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 20080);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/image_list', image.list);
app.post('/image_post', image.post);
app.get('/image_jpeg', image.jpeg);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


