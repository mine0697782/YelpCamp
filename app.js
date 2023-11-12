const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('./models/campground')

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log('Database connected')
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


app.get('/', (req, res) => {
    res.render('home')
})

// showing All campgrounds
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
})

// showing campground by id
app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params
    console.log(`showing campground bia /GET campground/id:${id}`)
    const campground = await Campground.findById(id)
    res.render('campgrounds/show', { campground })
})

// app.get('/makecampground', async (req, res) => {
//     const camp = new Campground({title: 'My Backyard', description: 'cheap camping'})
//     await camp.save()
//     res.send(camp)
// })

const port = 3000
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})