'use strict';

module.exports = buses;
var buses = require('../../models/buses.js');
var _ = require('underscore');

function buses(app){
	app.get('/api/buses', function (req, res) {
		buses.findAll({
			raw: true
		}).asCallback(
			function(err, buses) {
				if (err) {
					res.send("error");
					console.log(err);
				} else  {
			    res.setHeader('Content-Type', 'application/json');
			    res.send(JSON.stringify(buses));
		    	}
			}
		);
	});
}
