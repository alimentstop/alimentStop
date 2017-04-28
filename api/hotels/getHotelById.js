'use strict';

module.exports = getHotelById;
var hotels = require('../../models/hotels.js');
var _ = require('underscore');

function getHotelById(app){
	app.get('/api/hotels/:id', function (req, res) {
		hotels.findOne({
			where: {
				id: req.params.id
			},
			raw: true
		}).asCallback(
			function(err, hotel) {
				if (err) {
					res.send("error");
					console.log(err);
				} else  {
					if (_.isEmpty(hotel))
						res.status(404).send({error: 'hotel not found'});
					else{
				    res.setHeader('Content-Type', 'application/json');
				    res.send(JSON.stringify(hotel));
				  }
	    	}
			}
		);
	});
}
