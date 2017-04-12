'use strict';
var Sequelize = require('sequelize');
var hotels = require('./hotels.js');
var buses = sequelize.define('buses', {
  id: {
    type     : Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
    },
  busRegNo: Sequelize.STRING,
  hotelId: Sequelize.INTEGER,
  conductorName: Sequelize.STRING,
  driverName: Sequelize.STRING,
  startPoint: Sequelize.STRING,
  endPoint: Sequelize.STRING,
  latitude: Sequelize.STRING,
  longitude: Sequelize.STRING},
  {indexes: [
    {unique: true, fields: ['id']},
    {unique: true, fields: ['busRegNo']}
    ]
  }
 );

module.exports = buses;
