// const {Sequelize, Model, DataTypes} = require('sequelize')
// const sequelize = new Sequelize('sqlite::memory:')

// //added
// const sequelize = process.env.NODE_ENV === 'test'
//     ? new Sequelize('sqlite::memory:', null, null, {dialect: 'sqlite'})
//     : new Sequelize({dialect: 'sqlite', storage: path.join(__dirname, 'data.db')})
    
const {Sequelize, Model, DataTypes} = require('sequelize')
const path = require('path')
const sequelize = process.env.NODE_ENV === 'test'
    ? new Sequelize('sqlite::memory:', null, null, {dialect: 'sqlite'})
    : new Sequelize({dialect: 'sqlite', storage: path.join(__dirname, 'data.db')})

        
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

Restaurant.hasMany(Menu, {as: 'menus'})
Menu.belongsTo(Restaurant)

class Item extends Model {}
Item.init({
    name: DataTypes.STRING,
    price: DataTypes.FLOAT
}, {sequelize})

Menu.hasMany(Item, {as: 'items'})
Item.belongsTo(Menu)

module.exports = { Restaurant, Menu, Item, sequelize }

//npm sequalize documentation