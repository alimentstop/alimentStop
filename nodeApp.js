var express = require('express');
var app = express();
var https = require('https');
var Sequelize = require('sequelize');
var async = require('async');
var schedule = require('node-schedule');
var _ = require('underscore');
var glob = require('glob');
var session = require('express-session');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
pgSession = require('connect-pg-simple')(session);
app.use(session({
  store: new pgSession({
    conString : "postgres://postgres:1234@localhost:5432/tempas"
  }),
  secret: '2C44-4D44-WppQ38S',
  resave: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days 
}));

app.use(express.static(__dirname + '/'));

var sequelize = new Sequelize('tempas', 'postgres', '1234', {
  host: 'localhost',
  dialect: 'postgres',
  define: {
    freezeTableName: true
  },
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  logging: true
});

sequelize.sync();
global.sequelize = sequelize;

// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  console.log ("in auth");
  if (req.session && req.session.email) {
    return next();
  }
  else
    res.sendFile(__dirname + '/login.html');
};

// Login endpoint
app.post('/login', function (req, res) {
  if (!req.body) {
    console.log("Login Failed");
    res.sendFile(__dirname + '/login.html');
  } else {
    console.log("logging in ", req.body);
    res.redirect('/api/login/' + req.body.email + '/' + req.body.password);
  }
});

app.get('/login', function (req, res) {
  res.sendFile(__dirname + '/login.html');
});

glob.sync('./models/*.js').forEach(
  function (schemaPath) {
    require(schemaPath);
  }
);

glob.sync('./api/*/*').forEach(
  function (route) {
    console.log("init", route);
    require(route)(app);
  }
);

app.get('/home', function (req, res) {
  console.log("index");
  res.sendFile(__dirname + '/index.html');
});

app.get('/ordersByBus/:busId', function (req, res) {
  console.log("ordersByBus");
  console.log(__dirname + '/ordersByBus.html');
  res.sendFile(__dirname + '/ordersByBus.html');
});

app.get('/logout', auth, function (req, res) {
  req.session.destroy();
  res.redirect('/home');
});

app.listen(3000, function () {
  console.log('app started at http://localhost:3000');
});
