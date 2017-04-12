'use strict';
var Sequelize = require('sequelize');

var menuItems = sequelize.define('menuItems', {
  id: {
    type     : Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
    },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  name: Sequelize.STRING,
  group: Sequelize.STRING,
  price: Sequelize.INTEGER,
  hotelId: Sequelize.INTEGER},
  {indexes: [{unique: true, fields: ['id']}]}
 );

module.exports = menuItems;
