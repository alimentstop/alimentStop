'use strict';

module.exports = createOrder;
var menuItems = require('../../models/menuItems.js');
var _ = require('underscore');

function createOrder(app){
	app.put('/api/menuItems/:id', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    menuItems.update(
      {
        isActive: false
      },
      {
        where: {
          id: req.params.id
        }
      }).asCallback(
    	function(err, updatedMenuItem) {
    		if (err) {
    			res.status(404).send({error: 'Sequelize error:' + err.message});
    		}
  			res.send(updatedMenuItem);
    	}
  	);
	});
}
