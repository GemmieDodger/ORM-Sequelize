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

class Item extends Model {}
Item.init({
    name: DataTypes.STRING,
    price: DataTypes.FLOAT
}, {sequelize})

Menu.hasMany(Item)
Item.belongsTo(Menu)

module.exports = { Restaurant, Menu, Item, sequelize }

//npm sequalize documentation