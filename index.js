const startupDebug = require('debug')('app:startup')
const dbDebug = require('debug')('app:db')
// const config = require('config')
const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('joi');
const express = require('express');
const logger = require('./logger')

const app = express();
// if something relies on a dependency, put it bellow that dependency

//Configuration accessing example:
// console.log('Application Name: ', config.get('name'));
// console.log('Mail Sever: ', config.get('mail.host'));

//db work
dbDebug('debug work..')

app.set('view engine', 'pug')
// express internally loads pug without needing to require it
app.set('views', './views'); //default

// Middleware
app.use(express.json())
// allows us to use url encoded req body
app.use(express.urlencoded({extended: true}))
//allows is to serve static content
app.use(express.static('public'))
app.use(helmet())

console.log("ENV = ", app.get('env'))

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  startupDebug('Morgan Enabled...')
  //^ to trigger debug to show in the terminal:
  // export DEBUG=app:startup
  // multiple: export DEBUG=app:startup,app:db
  // all name spaces: export DEBUG=app:*
}

app.use(logger)

const courses = [{
    id: 0,
    name: "math"
  },
  {
    id: 1,
    name: "science"
  },
  {
    id: 2,
    name: "AP lit"
  },
  {
    id: 3,
    name: "art"
  },
]

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required()
  }
  return Joi.validate(course, schema);
}

// homepage
app.get('/', (req, res) => {
  res.render('index', {title: "Homepage", message: "Hello Kitty"})
  //^ with pug templating engine
  // res.send('Hello Kitty');
});

// get all courses
app.get('/api/courses', (req, res) => {
  res.send(courses);
});

// creates a new course
app.post('/api/courses', (req, res) => {
  // checks for validation errors
  const { error } = validateCourse(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  //creates new course 
  const course = {
    id: courses.length,
    name: req.body.name
  }
  // adds it to hardcoded "database"
  courses.push(course);
  res.send(course);
});

// update course
app.put('/api/courses/:id', (req, res) => {
  // look up the course w id
  const course = courses.find(c => c.id === parseInt(req.params.id))
  if (!course) return res.status(404).send("The course with the given id was not found");
  
  // validate the course
  const { error } = validateCourse(req.body)
  if (error) return res.status(400).send(error.details[0].message);

  // overwrite values in the course
  course.name = req.body.name;
  res.send(course);
});

// get specific course
app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id))
  if (!course) return res.status(404).send("The course with the given id was not found");
  res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
  // Look up the course
  //not existing, return 404
  const course = courses.find(c => c.id === parseInt(req.params.id))
  if (!course) return res.status(404).send("The course with the given id was not found");

  // delete
  const ind = courses.indexOf(course);
  courses.splice(ind, 1)

  // return the deleted course
  res.send(course);
});

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))