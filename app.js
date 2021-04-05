const express = require('express');
const app = express();

// Include Path NPM Package to run Node Command from anywhere 
// (If not Included & Wrote path.join(---)... then directories
// like Views, Models will not be accessible.
const path = require('path');

// Include Method Override NPM Package to perform UPDATE or DELETE 
// from HTML Forms (as only GET & POST are allowed by default)
const methodOverride = require('method-override');

// Include Campground Model from Models Directory
const Campground = require('./models/campground');

// Connection of Mongoose with NodeJS
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

// Connection of Mongoose with MongoDB
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// Setting EJS as default View Engine/ Templating Language for Dynamic HTML
app.set('view engine', 'ejs');

// Access Views Directory from Anywhere using Terminal
app.set('views', path.join(__dirname, 'views'))

// To Parse Data from HTML Forms (in URLEncoded Format)
app.use(express.urlencoded({ extended: true }));

// To Use PUT(or PATCH) and DELETE - operations in HTML Forms
// (By Default only GET and POST are supported)
app.use(methodOverride('_method'));

// Home Page
app.get('/', (req, res) => {
    res.render('home')
});

// GET Request => Webpage showing List of All Campgrounds
app.get('/campgrounds', async (req, res) => {
    // Get All Campgrounds from MongoDB in 'campgrounds'
    const campgrounds = await Campground.find({}); 
    res.render('campgrounds/index', { campgrounds })
});

// Webpage for Adding a New Campground
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

// POST Request => Adding a New Campground in MongoDB 
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

// GET Request => Details of a particular Campground
app.get('/campgrounds/:id', async (req, res,) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', { campground });
});

// Webpage for Updating a particular Campground
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
})

// PUT (Update) Request => Update a Particular Campground
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
});

// DELETE a Particular Campground
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

// Set up Express on Port Number 3000
app.listen(3000, () => {
    console.log('Serving on port 3000')
})