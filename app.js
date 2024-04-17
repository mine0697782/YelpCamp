const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync')
const Campground = require('./models/campground')
const methodOverride = require('method-override')
const morgan = require('morgan')

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log('Database connected')
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(morgan('dev'))

const verifyPassword = (req, res, next) => {
    const { password } = req.query
    if (password === 'chickennugget') {
        next()
    } else {
        res.send("SORRY, IT'S PROTECTED. YOU NEED PASSWORD")
    }
}

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/secret', verifyPassword, (req, res) => {
    res.send('My Secret')
})

// showing All campgrounds
app.get('/campgrounds', catchAsync(async (req, res) => {
    // console.log('showing All Campgrounds (MAIN PAGE)')
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}))

// making new campground
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

// showing campground by id
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    // console.log(`showing campground bia /GET campground/id:${id}`)
    const campground = await Campground.findById(id)
    res.render('campgrounds/show', { campground })
}))

// modifing campground
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground })
}))

app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    // 위의 코드와 아래의 코드는 동일하게 동작함
    // const campground = await Campground.findById(id)
    // const { title, location } = req.body.campground
    // campground.title = title
    // campground.location = location
    // await campground.save()
    res.redirect(`/campgrounds/${id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    console.log('delete')
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))

app.use((req, res) => {
    res.status(404).send('NOT FOUND!')
})

app.use((err, req, res, next) => {
    res.send('Oh, something weng wrong!')
})

app.listen(3000, () => {
    console.log(`Serving on port 3000`)
})