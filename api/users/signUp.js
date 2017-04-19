'use strict';

module.exports = userLogin;
var users = require('../../models/users.js');
var _ = require('underscore');

function userLogin(app) {
  app.post('/api/signUp', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    var user = req.body;
    if (!user.name)
    	return res.status(404).send({error: "No name is sent"});
    if (!user.email)
    	return res.status(404).send({error: "No email is sent"});
    if (!user.pass)
    	return res.status(404).send({error: "No pass is sent"});
    console.log(user);
    users.create({
    	name: user.name,
    	email: user.email,
    	password: user.pass
    }).asCallback(
    	function(err, createdUser) {
    		if (err) {
    			res.status(404).send({error: 'Sequelize error:' + err.name});
    		}
        else {
          req.session.email = createdUser.email;
          req.session.userId = createdUser.id;
	        res.send(_.omit(createdUser, 'password'));
        }
    	}
  	);
  });
}
