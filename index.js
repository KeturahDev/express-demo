const Joi = require('joi');
const express = require('express');
const app = express();
// if something relies on a dependency, put it bellow that dependency

// adds a piece of middleware
// allows resps/reqs to be read in json format
app.use(express.json())

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
  res.send('Hello Kitty');
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