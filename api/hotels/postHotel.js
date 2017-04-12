'use strict';

module.exports = postHotel;
var hotels = require('../../models/hotels.js');
var _ = require('underscore');

function postHotel(app){
	app.post('/api/hotels', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var hotel = req.body;
    if (!hotel.name)
    	return res.status(404).send({error: "No name is sent"});
    if (!hotel.location)
    	return res.status(404).send({error: "No location is sent"});
    hotels.create({
    	name: hotel.name,
    	location: hotel.location
    }).asCallback(
    	function(err, createdHotel) {
    		if (err) {
    			res.status(404).send({error: 'Sequelize error:' + err.message});
    		}
  			res.send(createdHotel);
    	}
  	);
	});
}
