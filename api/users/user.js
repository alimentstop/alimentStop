'use strict';

module.exports = user;
var users = require('../../models/users.js');
var _ = require('underscore');

function user(app) {
  app.get('/api/user', function(req, res) {

    if (req.session && req.session.email) {
      users.findOne({
        where: {
          email: req.session.email
        },
        raw: true
      }).asCallback(
        function(err, user) {
          if (err)
            res.send("error");
          else if (_.isEmpty(user)) {
            res.send("no user found");
          } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(_.omit(user, 'password')));
          }
        }
      );
    } else {
      res.status(404).send({
        error: 'Not logged in'
      });
    }
  });
}
