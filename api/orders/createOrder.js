'use strict';

module.exports = createOrder;
var orders = require('../../models/orders.js');
var _ = require('underscore');

function createOrder(app){
	app.post('/api/orders', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var sentOrders = req.body;
    console.log(sentOrders);
    _.each(sentOrders,
    	function (order) {
		    if (!order.busId)
		    	return res.status(404).send({error: "No busId is sent"});
		    if (!order.seatNo)
		    	return res.status(404).send({error: "No seatNo is sent"});
		    if (!order.menuItemId)
		    	return res.status(404).send({error: "No menuItemId is sent"});
		    if (!order.quantity)
		    	return res.status(404).send({error: "No quantity is sent"});
				orders.upsert({
		      busId:order.busId,
		      seatNo: order.seatNo,
		      menuItemId: order.menuItemId,
		      quantity: order.quantity
		    }).then(function(test){
		      console.log("order created");
		    });
    	}
  	);
  	res.send({status: "ok"});
	});
}
