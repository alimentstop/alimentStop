'use strict';

module.exports = menuItemsByHotelId;
var menuItems = require('../../models/menuItems.js');
var _ = require('underscore');

function menuItemsByHotelId(app){
	app.get('/api/menuItems/:hotelId', function (req, res) {
		buses.findAll({
			where: {
				hotelId: req.params.hotelId
			},
			raw: true
		}).asCallback(
			function(err, menuItems) {
				if (err) {
					res.send("error");
					console.log(err);
				} else  {
					if (_.isEmpty(menuItems))
						res.status(404).send({error: 'menuItems not found'});
					else{
				    res.setHeader('Content-Type', 'application/json');
				    res.send(JSON.stringify(menuItems));
				  }
	    	}
			}
		);
	});
}
