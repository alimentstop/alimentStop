'use strict';

module.exports = buses;
var buses = require('../../models/buses.js');
var _ = require('underscore');

function buses(app){
	app.get('/api/buses/:id', function (req, res) {
		buses.findOne({
			where: {
				id: req.params.id
			},
			raw: true
		}).asCallback(
			function(err, bus) {
				if (err) {
					res.send("error");
					console.log(err);
				} else  {
					if (_.isEmpty(bus))
						res.status(404).send({error: 'Bus not found'});
					else{
				    res.setHeader('Content-Type', 'application/json');
				    res.send(JSON.stringify(bus));
				  }
	    	}
			}
		);
	});
}
