const startupDebug = require('debug')('app:startup')
const dbDebug = require('debug')('app:db')
const morgan = require('morgan');
const helmet = require('helmet');
const courses = require('./routes/courses')
const homepage = require('./routes/home')
const express = require('express');
const logger = require('./middleware/logger')
const app = express();


app.set('view engine', 'pug')
app.set('views', './views'); //default
app.use('/api/courses', courses);
app.use('/', homepage);



//db work
dbDebug('debug work..')

// Middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(helmet())

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  startupDebug('Morgan Enabled...')
}

app.use(logger)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))