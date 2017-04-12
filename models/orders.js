'use strict';
var Sequelize = require('sequelize');

var orders = sequelize.define('orders', {
  id: {
    type     : Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
    },
  busId: Sequelize.INTEGER,
  seatNo: Sequelize.STRING,
  orderComplete: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  date: Sequelize.DATE,
  menuItemId: Sequelize.INTEGER,
  quantity: Sequelize.INTEGER},
  {indexes: [
    {unique: true, fields: ['id']},
    {unique: true, fields: ['busId', 'seatNo', 'orderComplete', 'menuItemId']}
    ]
  }
 );

module.exports = orders;
