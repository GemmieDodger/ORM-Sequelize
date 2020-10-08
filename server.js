const express = require('express')
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const app = express()
const {restaurant, Menu, sequelize, Restaurant, Item} = require('./models')
 //allows sql compatibility

// const {readFile} = require('fs/promises') //FYI file system API is wrapped in promisses
// const path = require('path')
const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)

})
app.use(express.static('public'))
app.engine('handlebars', handlebars)
app.set('view engine', 'handlebars')

app.get('/', (request, response) => {
    response.render('home', {date: new Date(), name: "Gemma Druce"})
})

app.get('/restaurants', async (request, response) => {
    const restaurants = await Restaurant.findAll({
        include: [
            {model: Menu, as: 'menus'} //check this
        ]
    })    
    console.log(restaurants)
    response.render('restaurants', {restaurants, date: new Date(), name: "Gemma Druce"})
})

app.get('/restaurants/:id', async (request, response) => {
    const restaurant = await Restaurant.findByPk(request.params.id)
    const menus = await restaurant.getMenus({
        include: [
            {model: Item, as: 'items'}
        ]
    })
    response.render('restaurant', {restaurant, menus, date: new Date(), name: "Gemma Druce"})
})
app.listen(3000, async ()  => {
    await sequelize.sync
    console.log("Web server is running")
})