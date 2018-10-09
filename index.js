var express = require('express');
var path = require('path');
var exphbs = require('express-handlebars');
var { Client } = require('pg');
var bodyParser = require('body-parser');
var Admin = require('./models/admin');
var Student = require('./models/student');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var session = require('express-session');
var bcrypt = require('bcrypt');
var saltRounds = 10;

require('dotenv').config();

const client = new Client({
  database: 'd37rmk4rahu9ke',
  user: 'cgzkofiejtdtnd',
  password: '7320c638aae6dec62e1d230dae433d527afbb77f864d4d69e58d3941cbdf783d',
  host: 'ec2-23-21-171-249.compute-1.amazonaws.com',
  port: 5432,
  ssl: true
});

client.connect()
  .then(function () {
    console.log('connected to database!');
  })
  .catch(function (err) {
    console.log(err);
  });

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('port', (process.env.PORT || 3000));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var role;
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize()); 
app.use(passport.session());



passport.use(new Strategy({
  usernameField: 'email',
  passwordField: 'password'
},
  function(email, password, cb) {
    Admin.getByEmail(client, email, function(user) {
      if (!user) { return cb(null, false); }
      bcrypt.compare(password, user.password).then(function(res) {
      if (res == false) { return cb(null, false); }
      return cb(null, user);
    });
      });
  }));

passport.serializeUser(function(user, cb) {
  console.log('serializeUser', user)
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  console.log('deserializeUser', id)
  Admin.getById(client, id, function (user) {
    cb(null, user);
  });
});

app.get('/', function (req,res){
    res.render('index');
});

app.get('/login', function (req,res){
    res.render('index');
});

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
  res.redirect('/admin/faculties');
});

app.get('/admin/faculties', function (req,res){
  if(req.isAuthenticated()){
    Admin.facultyList(client, {}, function(facultyList){
    res.render('admin/admin',{
      layout: 'admin',
      facultyList: facultyList
    });
    });
  }
    else{
      res.redirect('/login');
    }
    });


app.get('/admin/students', function (req,res){
  if(req.isAuthenticated()){
    Student.studentList(client, {}, function(studentList){
    res.render('admin/students',{
      layout: 'admin',
      studentList: studentList
    });
    });
  }
  else{
      res.redirect('/login');
    }
});

app.get('/admin/classes', function (req,res){
  if(req.isAuthenticated()){
    Student.classList(client, {}, function(classList){
    res.render('admin/classes',{
      layout: 'admin',
      classList: classList
    });
  });
  }
    else{
      res.redirect('/login');
    }
});

app.get('/admin/create/faculty', function (req,res){
  if(req.isAuthenticated()){
    res.render('admin/create-faculty',{
      layout: 'admin'
    });
  }
      else{
      res.redirect('/login');
    }
});

app.post('/admin/insert/faculty', function (req,res){
  bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
    Admin.facultyCreate(client,{
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    userType: req.body.userType,
    password: hash

},
  function(user){

    if(user == 'SUCCESS'){
      res.redirect('/admin/faculties');
}
    else if (user == 'ERROR'){
      console.log('Error!')
    }

  });
});
});


app.get('/admin/create/student', function (req,res){
    if(req.isAuthenticated()){
    res.render('admin/create-student',{
      layout: 'admin'
    });
  }
    else{
      res.redirect('/login');
    }
});

app.post('/admin/insert/student', function (req,res){
  bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
    Student.studentCreate(client,{
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    studentNumber: req.body.studentNumber,
    email: req.body.email,
    userType: req.body.userType,
    password: hash
},
  function(user){

    if(user == 'SUCCESS'){
      res.redirect('/admin/students');
}
    else if (user == 'ERROR'){
      console.log('Error!')
    }

  });
});
});

app.get('/admin/create/class', function (req,res){
  if(req.isAuthenticated()){
Admin.adviserList(client, {}, function(adviserList){
    res.render('admin/create-class',{
      layout: 'admin',
      adviserList: adviserList
    });
    });
  }
      else{
      res.redirect('/login');
    }
});

app.post('/admin/create/class', function (req,res){
    Student.classCreate(client,{
    batch: req.body.batch,
    section: req.body.section,
    adviser_id: req.body.adviser_id
},
  function(user){

    if(user == 'SUCCESS'){
      res.redirect('/admin/classes');
}
    else if (user == 'ERROR'){
      console.log('Error!')
    }

  });
});

//app.post('/admin/create/class', function(req,res){
//var batch = req.body.batch;
//var section = req.body.section;
//var adviser_id = req.body.adviser_id;
//console.log(batch,section,adviser_id);
//});


app.listen(app.get('port'), function () {
  console.log('Server started at port 3000');
});
