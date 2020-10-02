//const { Restaurant, Menu } = require("./models")

const {Restaurant, sequelize, Menu} = require('./models.js')

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

        //check can pull back a menu

        //check can read a restaurant
    })

})

// describe('Menu', () => {
//     test('when a menu is created and added to a database', async () => {
//         const menu = await Menu.create({title:})
//     })
// })

