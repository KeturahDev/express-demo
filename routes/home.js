const express = require('express')
const router = express.Router();


// homepage
router.get('/', (req, res) => {
  res.render('index', {title: "Homepage", message: "Hello Kitty"})
  //^ with pug templating engine
  // res.send('Hello Kitty');
});

module.export = router;