//const { Restaurant, Menu } = require("./models")

const {Restaurant, sequelize, Menu, Item} = require('./models.js')

beforeAll(async () => {
    await sequelize.sync()
})
describe('Restaurant', () => {

    test('when a restaurant is created add to a database', async () => {
        const restaurant = await Restaurant.create({name:'The Triangle', image: "image.url"})    
        // console.log(restaurant.id)
        expect(restaurant.id).toBeTruthy()
        expect(restaurant.createdAt).toBeTruthy()
    })    
   
    test('can add a menu to a restaurant', async () =>{
        const restaurant = await Restaurant.create({name: "Sunny Days", image: "image.url"})
        const menu = await Menu.create({title: "Brunch"})
        await restaurant.addMenu(menu)
        const menus = await restaurant.getMenus()
        expect(menus.length).toBe(1)
    })
        //check can pull back more than one menu
    test('can pull back a menu', async () => {
        const restaurant = await Restaurant.create({name: "Happy Chef", image: "image.url"})
        const menu = await Menu.create({title: "Dinner"})
        await restaurant.addMenu(menu)
        // console.log("post-first menu")
        // console.log(menu)
        const menu2 = await Menu.create({title: "Lunch"})
        await restaurant.addMenu(menu2)
        // console.log("post-second menu")
        // console.log(menu)
        const menus = await restaurant.getMenus()
        expect(menus.length).toBe(2)
        expect(menus[1].title).toBe("Lunch")
        // console.log('hello I am here')
        // console.log(menus)
    })    

    //can build a restaurant with items
    test('add an item to a menu and restaurant', async () => {
        const restaurant = await Restaurant.create({name:"Tasty Moments", image: "image.url"})
        const menu = await Menu.create({title: "Dessert"})
        const item = await Item.create({name: "Sticky Toffee Pudding", price: 4.00})
        const item2 = await Item.create({name: "Chocolate Sponge", price: 5.00})
        await restaurant.addMenu(menu)
        await menu.addItem(item)
        await menu.addItem(item2)
        const menus = await restaurant.getMenus() 
        const items = await menu.getItems()
        expect(items.length).toBe(2)
        console.log(menus)
        console.log(items)
    })

    //can build a restaurant with multiple items/multiple 
    test('add multiple items to the menu and restaurant', async () => {
        const restaurant = await Restaurant.create({name: "Green Gods", image: "image.url"})
        const menu1 = await Menu.create({title: "Main"})
        const menu2 = await Menu.create({title: "Dessert"})
        const item1 = await Item.create({name: "Chocolate Cake", price: 6.00})
        const item5 = await Item.create({name: "Cheese and Biscuits", price: 8.00})
        const item3 = await Item.create({name: "Roast Chicken", price: 15.00})
        const item4 = await Item.create({name: "Spaghetti Bolanaise", price: 12.00})
        await restaurant.addMenu(menu1)
        await restaurant.addMenu(menu2)
        // await menu1.addItem(item3, item4)
        await menu1.addItem([item3, item4])
        await menu2.addItem([item1,item5])
        // await menu2.addItem(item2)
        const menus = await restaurant.getMenus()
        const items1 = await menu1.getItems()
        const items2 = await menu2.getItems()
        console.log('this should bring back two menus')
        console.log(menus)
        console.log('this should bring back two mains roast + bol')
        console.log(items1)
        console.log('this should bring back two desserts choc cake + cheese')
        console.log(items2)
        console.log('happy dinner time!')
    })
})

//CREATE A MENU WITH ITEMS
describe('Menu', () => {
    test('add an item to a menu', async () => {
        // const restaurant = await Restaurant.create({name: "WaterFalls", image: "image.url"})
        const menu = await Menu.create({title:"Brunch"})
        const item = await Item.create({name: "Avocado on toast", price: "4.00"})
        await menu.addItem(item)
        const items = await menu.getItems()
        expect(items.length).toBe(1)
        expect(items[0].name).toBe('Avocado on toast')
    })
})

