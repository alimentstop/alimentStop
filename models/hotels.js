'use strict';
var Sequelize = require('sequelize');

var hotels = sequelize.define('hotels', {
  id: {
    type     : Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
    },
  name: Sequelize.STRING,
  location: Sequelize.STRING,
  latitude: Sequelize.STRING,
  longitude: Sequelize.STRING},
  {indexes: [
    {unique: true, fields: ['id']}
    ]
  }
 );

module.exports = hotels;
