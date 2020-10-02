const {Sequelize, Model, DataTypes} = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

class Restaurant extends Model {}    
//this is a static function
Restaurant.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING
}, {sequelize: sequelize}) // , name: 'restaurants' name is optional   

class Menu extends Model {}
Menu.init({
    title: DataTypes.STRING
}, {sequelize})

Restaurant.hasMany(Menu)
Menu.belongsTo(Restaurant)

module.exports = { Restaurant, Menu, sequelize }

//npm sequalize documentation