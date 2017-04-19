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
var request = require('request');
var path = require('path');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
pgSession = require('connect-pg-simple')(session);
app.use(session({
  store: new pgSession({
    conString: "postgres://postgres:1234@localhost:5432/tempas"
  }),
  secret: '2C44-4D44-WppQ38S',
  resave: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000
  } // 30 days
}));

app.use(express.static(path.join(__dirname, 'pages')));

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

glob.sync('./models/*.js').forEach(
  function(schemaPath) {
    require(schemaPath);
  }
);

glob.sync('./api/*/*').forEach(
  function(route) {
    console.log("init", route);
    require(route)(app);
  }
);

app.get('/login', function(req, res) {
  res.sendFile(__dirname + '/pages/login.html');
});
// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  console.log("in auth");
  if (req.session && req.session.email) {
    console.log("found");
    return next();
  } else
    res.redirect('/login');
};

app.get('/', auth, function(req, res) {
  res.sendFile(__dirname + '/pages/main.html');
});

// Login endpoint
app.post('/login', function(req, res) {
  if (!req.body) {
    console.log("Login Failed");
    res.sendFile(__dirname + '/login.html');
  } else {
    console.log("logging in ", req.body);
    res.redirect('/api/login/' + req.body.email + '/' + req.body.password);
  }
});

// SignUp endpoint
app.post('/signUp', function(req, res) {
  console.log("signing up ", req.body);
  request.post(
    'http://localhost/api/signUp', {
      json: {
        name: req.body.name,
        email: req.body.email,
        pass: req.body.pass,
      }
    },
    function(error, response, body) {
      res.redirect('/');
    }
  );
});

app.get('/ordersByBus/:busId', auth, function(req, res) {
  console.log("ordersByBus");
  console.log(__dirname + '/ordersByBus.html');
  res.sendFile(__dirname + '/ordersByBus.html');
});

app.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/login');
});

app.get('*', function(req, res) {
  res.send('what???', 404);
});

app.listen(80, function() {
  console.log('app started at port 80');
});
