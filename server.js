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
    response.render('restaurants', {restaurants, date: new Date(), name: "Gemma Druce"})
})

//GET RESTAURANT SINGULAR

app.get('/restaurants/:restaurant_id', async (request, response) => {
    const restaurant = await Restaurant.findByPk(request.params.restaurant_id)

    const menus = await restaurant.getMenus({
        include: [
            {model: Item, as: 'items'}
        ]
    })
    response.render('restaurant', {restaurant, menus, date: new Date(), name: "Gemma Druce"})
})

//link to GET edit restaurant
app.get('/restaurants/:restaurant_id/editRestaurant', async(request, response) => {
    const restaurant = await Restaurant.findByPk(request.params.restaurant_id)
    response.render('editRestaurant', {restaurant})
})

// EDIT RESTAURANT

app.post('/restaurants/:restaurant_id/editRestaurant', async (request, response) => {
    const restaurant = await Restaurant.findByPk(request.params.restaurant_id)
    await restaurant.update(request.body)
    response.redirect(`/restaurants/${request.params.restaurant_id}`)
})

//CREATE RESTAURANT
app.post('/restaurants', async (request, response) => {
    await Restaurant.create(request.body)
    response.redirect(('/restaurants'))
})

//delete restaurant
app.get('/restaurants/:restaurant_id/deleteRestaurant', (request, response) => {
    Restaurant.findByPk(request.params.restaurant_id)
    .then(restaurant => {
        restaurant.destroy()
        response.redirect('/restaurants')
    })
})
//MENUS
//CREATE  MENUS - WORKS

app.post('/restaurants/:restaurant_id/menus', async (request, response) => {
    const restaurant = await Restaurant.findByPk(request.params.restaurant_id)
    await restaurant.createMenu({title:request.body.title})
    response.redirect((`/restaurants/${request.params.restaurant_id}`))
})


// GET TO EDIT MENU
app.get('/restaurants/:restaurant_id/menus/:menu_id/editMenu', async(request, response) => {
    const restaurant = await Restaurant.findByPk(request.params.restaurant_id)
    const menu = await Menu.findByPk(request.params.menu_id)
    const items = await menu.getItems()
    response.render('editMenu',{restaurant, menu, items, date: new Date(), name: "Gemma Druce"})

})

//DELETE MENU

app.get('/restaurants/:restaurant_id/menus/:menu_id/deleteMenu', async (request, response) => {
    Restaurant.findByPk(request.params.restaurant_id)
    Menu.findByPk(request.params.menu_id)
    .then(menu => {
        menu.destroy()
        response.redirect(`/restaurants/${request.params.restaurant_id}`)
    })
        
})

//EDIT MENU TITLE
app.post('/restaurants/:restaurant_id/menus/:menu_id/editMenu', async (request, response) => {
    const restaurant = await Restaurant.findByPk(request.params.restaurant_id)
    const menu = await Menu.findByPk(request.params.menu_id)
    await menu.update(request.body)
    response.redirect(`/restaurants/${request.params.restaurant_id}/menus/${request.params.menu_id}/editMenu`)
})

//ITEMS


//UPDATE ITEM - not working
app.post('/restaurants/:restaurant_id/menus/:menu_id/editMenu', async (request, response) => {
    const restaurant = await Restaurant.findByPk(request.params.restaurant_id)
    const menu = await Menu.findByPk(request.params.menu_id)
    const item = await Item.findByPk(request.params.item_id)
    // console.log(item)
    await item.update(request.body) 
    response.redirect(`/restaurants/${request.params.restaurant_id}/menus/${request.params.menu_id}/editMenu`)
})
//ADD NEW ITEM - YES
app.post('/restaurants/:restaurant_id/menus/:menu_id/items', async (request, response) => {
    const restaurant = await Restaurant.findByPk(request.params.restaurant_id)
    const menu = await Menu.findByPk(request.params.menu_id)
    await menu.createItem({name:request.body.name, price:request.body.price})
    response.redirect((`/restaurants/${request.params.restaurant_id}/menus/${request.params.menu_id}/editMenu`))
})


//DELETE ITEM - YES
app.get('/restaurants/:restaurant_id/menus/:menu_id/items/:item_id/deleteItem', async (request, response) => {
    Restaurant.findByPk(request.params.restaurant_id)
    Menu.findByPk(request.params.menu_id)
    Item.findByPk(request.params.item_id)
    .then(item => {
        item.destroy()
        response.redirect(`/restaurants/${request.params.restaurant_id}/menus/${request.params.menu_id}/editMenu`)
    })  
})

app.listen(3000, async ()  => {
    await sequelize.sync
    console.log("Web server is running")
})