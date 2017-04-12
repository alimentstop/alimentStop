'use strict';

module.exports = createOrder;
var menuItems = require('../../models/menuItems.js');
var _ = require('underscore');

function createOrder(app){
	app.post('/api/menuItems', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var menuItem = req.body;
    if (!menuItem.name)
    	return res.status(404).send({error: "No name is sent"});
    if (!menuItem.price || (typeof menuItem.price !== 'number'))
    	return res.status(404).send({error: "No price is sent"});
    if (!menuItem.hotelId || (typeof menuItem.hotelId !== 'number'))
        return res.status(404).send({error: "No hotelId is sent"});
    if (!menuItem.group)
    	return res.status(404).send({error: "No group is sent"});
    menuItems.create({
    	name: menuItem.name,
    	price: menuItem.price,
    	hotelId: menuItem.hotelId,
        group: menuItem.group
    }).asCallback(
    	function(err, createdMenuItem) {
    		if (err) {
    			res.status(404).send({error: 'Sequelize error:' + err.message});
    		}
  			res.send(createdMenuItem);
    	}
  	);
	});
}
