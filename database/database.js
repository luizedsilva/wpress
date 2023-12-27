const Sequelize = require("sequelize");

const connection = new Sequelize('wpress', 'root', 'myapp', {
    host: 'db',
    dialect: 'mysql',
    timezone: "-03:00"
});

module.exports = connection;