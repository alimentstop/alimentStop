'use strict';

module.exports = ordersByBusAndSeatIds;
var orders = require('../../models/orders.js');
var _ = require('underscore');

function ordersByBusAndSeatIds(app) {
  app.get('/api/orders/:busId/:seatNo', function(req, res) {
    orders.findAll({
      where: {
        seatNo: req.params.seatNo,
        busId: req.params.busId
      },
      raw: true
    }).asCallback(
      function(err, orders) {
        if (err) {
          res.send("error");
          console.log(err);
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(orders));
        }
      }
    );
  });
}
