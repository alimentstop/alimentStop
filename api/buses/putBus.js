'use strict';

module.exports = createOrder;
var buses = require('../../models/buses.js');
var _ = require('underscore');

function createOrder(app){
	app.put('/api/buses/:id', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var update = {};
    var bus = req.body;
    console.log(bus);
    if (bus.busRegNo)
      update.busRegNo = bus.busRegNo;
    if (bus.hotelId)
      update.hotelId = bus.hotelId;
    if (bus.startPoint)
      update.startPoint = bus.startPoint;
    if (bus.endPoint)
      update.endPoint = bus.endPoint;
    buses.update(
      update,
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
