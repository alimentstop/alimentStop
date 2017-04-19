'use strict';

module.exports = userLogin;
var users = require('../../models/users.js');
var _ = require('underscore');

function userLogin(app) {
  app.get('/api/login/:email/:password', function(req, res) {
    console.log("fetching users");
    console.log("finding", req.params);
    if (req.params && req.params.email) {
      users.findOne({
        where: {
          email: req.params.email
        }
      }).asCallback(
        function(err, user) {
          if (err)
            res.send("error");
          else if (_.isEmpty(user)) {
            res.send("no user found");
          } else {
            console.log("pass", user.password, req.params.password);
            if (user.password === req.params.password) {
              req.session.email = user.email;
              req.session.userId = user.id;
              res.redirect('/');
            } else {
              res.send("incorrect password");
            }
          }
        }
      );
    } else {
      res.send('Error');
    }
  });
}
