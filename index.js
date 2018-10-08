var express = require('express');
var path = require('path');
var exphbs = require('express-handlebars');
var { Client } = require('pg');
var bodyParser = require('body-parser');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var session = require('express-session');
var bcrypt = require('bcrypt');
var saltRounds = 10;

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('port', (process.env.PORT || 3000));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req,res){
    res.render('index');
});

app.listen(app.get('port'), function () {
  console.log('Server started at port 3000');
});
