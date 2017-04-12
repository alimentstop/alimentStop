'use strict';

module.exports = ordersByBusId;
var orders = require('../../models/orders.js');
var _ = require('underscore');

function ordersByBusId(app){
	app.get('/api/orders/:seatNo', function (req, res) {
		orders.findAll({
			where: {seatNo: req.params.seatNo},
			raw: true
		}).asCallback(
			function(err, orders) {
				if (err) {
					res.send("error");
					console.log(err);
				} else  {
			    res.setHeader('Content-Type', 'application/json');
			    res.send(JSON.stringify(orders));
		    }
			}
		);
	});
}
