'use strict';
var Sequelize = require('sequelize');

var users = sequelize.define('users', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  type: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  phone: Sequelize.STRING
}, {
  indexes: [{
    unique: true,
    fields: ['id']
  }, {
    unique: true,
    fields: ['email']
  }]
});

module.exports = users;
