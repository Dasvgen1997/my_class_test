const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://evgen@localhost:5432/test_db', {
  dialect: 'postgres',
});

module.exports = sequelize;