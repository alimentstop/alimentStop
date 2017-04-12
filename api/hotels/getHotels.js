'use strict';

module.exports = getHotels;
var hotels = require('../../models/hotels.js');
var _ = require('underscore');

function getHotels(app){
	app.get('/api/hotels', function (req, res) {
		hotels.findAll({
			raw: true
		}).asCallback(
			function(err, hotels) {
				if (err) {
					res.send("error");
					console.log(err);
				} else  {
			    res.setHeader('Content-Type', 'application/json');
			    res.send(JSON.stringify(hotels));
		    	}
			}
		);
	});
}
