'use strict';

module.exports = postBus;
var buses = require('../../models/buses.js');
var _ = require('underscore');

function postBus(app){
	app.post('/api/buses', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var bus = req.body;
    if (!bus.busRegNo)
    	return res.status(404).send({error: "No busRegNo is sent"});
    if (!bus.startPoint)
    	return res.status(404).send({error: "No startPoint is sent"});
    if (!bus.endPoint)
    	return res.status(404).send({error: "No endPoint is sent"});
    if (!bus.hotelId || (typeof bus.hotelId !== 'number'))
    	return res.status(404).send({error: "No hotelId is sent"});
    buses.create({
    	busRegNo: bus.busRegNo,
    	startPoint: bus.startPoint,
    	endPoint: bus.endPoint,
    	hotelId: bus.hotelId
    }).asCallback(
    	function(err, createdBus) {
    		if (err) {
    			res.status(404).send({error: 'Sequelize error:' + err.message});
    		}
  			res.send(createdBus);
    	}
  	);
	});
}
