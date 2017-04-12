'use strict';

module.exports = menuItems;
var menuItems = require('../../models/menuItems.js');
var _ = require('underscore');

function menuItems(app){
	app.get('/api/menuItems/:hotelId', function (req, res) {
		var where = {
			hotelId: req.params.hotelId
		};
		if (req.query.isActive)
			where.isActive = true;
		menuItems.findAll({
			where: where,
			raw: true
		}).asCallback(
			function(err, menuItems) {
				if (err) {
					res.send("error");
					console.log(err);
				} else  {
			    res.setHeader('Content-Type', 'application/json');
			    res.send(JSON.stringify(menuItems));
		    }
			}
		);
	});
}
