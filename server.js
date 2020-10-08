const express = require('express')
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const app = express()
const {restaurant, Menu, sequelize, Restaurant, Item} = require('./models')
const { response } = require('express')
 //allows sql compatibility

// const {readFile} = require('fs/promises') //FYI file system API is wrapped in promisses
// const path = require('path')
const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)

})
app.use(express.static('public'))
app.engine('handlebars', handlebars)
app.set('view engine', 'handlebars')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (request, response) => {
    response.render('home', {date: new Date(), name: "Gemma Druce"})
})

//GET ALL RESTAURANTS

app.get('/restaurants', async (request, response) => {
    const restaurants = await Restaurant.findAll({
        include: [
            {model: Menu, as: 'menus'} //check this
        ]
    })    
    console.log(restaurants)
    response.render('restaurants', {restaurants, date: new Date(), name: "Gemma Druce"})
})

//GET RESTAURANT SINGULAR

app.get('/restaurants/:id', async (request, response) => {
    const restaurant = await Restaurant.findByPk(request.params.id)
    const menus = await restaurant.getMenus({
        include: [
            {model: Item, as: 'items'}
        ]
    })
    response.render('restaurant', {restaurant, menus, date: new Date(), name: "Gemma Druce"})
})

//link to GET edit restaurant
app.get('/restaurants/:id/editRestaurant', async(request, response) => {
    const restaurant = await Restaurant.findByPk(request.params.id)
    response.render('editRestaurant', {restaurant})
})

//LINK TO edit restaurant

app.post('/restaurants/:id/editRestaurant', async (request, response) => {
    const restaurant = await Restaurant.findByPk(request.params.id)
    await restaurant.update(request.body)
    response.redirect(`/restaurants/${request.params.id}`) //this does not work
})

//CREATE RESTAURANT
app.post('/restaurants', async (request, response) => {
    console.log(request.body)
    await Restaurant.create(request.body)
    response.redirect(('/restaurants'))
})

app.post('/restaurant', async (request, response) => {
    await Menu.create(request.body)
    response.redirect(('/restaurant'))
})

//delete restaurant
app.get('/restaurants/:id/deleteRestaurant', (request, response) => {
    Restaurant.findByPk(request.params.id)
    .then(restaurant => {
        restaurant.destroy()
        response.redirect('/restaurants')
    })
})

/* THESE ARE NOT RIGHT
app.get('/restaurants/:id/delete', async(request, response) -> {
    const restaurant = await Restaurant. findByPk(REQ.PArams.id)
    await restaurant.destroy()
    response.redirect()
})

*/


//Should be able to get rid of this

// app.post('/restaurants/:id', async (request, response) => {
//     const restaurant = await Restaurant.findByPk(req.params.id)
//     restaurant.update(req.body)
//     response.redirect('/restaurants/${restaurant.id}')
// }
// )


app.listen(3000, async ()  => {
    await sequelize.sync
    console.log("Web server is running")
})