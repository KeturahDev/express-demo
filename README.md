# Express.js tutorial
Keturah Howard, November 13 2023

## About Express

- REST defines a set of conventions for creating HTTP services:
  - POST: to create a resource
  - PUT: to update it
  - GET: to read it
  - DELETE: to delete it 
- Express is a simple, minimalistic and lightweight framework for building web servers
- You should never trust data sent by the client. Always validate! Use Joi package to perform input validation. 

### Anatomy of cunstructing an endpoint

`app.get('/api/genres', (req, res) => {
  res.send(genres);
});`
- .get = HTTP method
- `/api/genres` = endpoint url.
- params would trail after grenres like `/:id`
- `( req, res)` must be in that order
- use `req`(request) to access body and params
- use `res`(response) to access send and status

### Build a web server
```
const express = require('express');
const app = express();
```

### Create Port to listen
```
const port = process.env.PORT || 300002;
app.listen(port, () => console.log(`Listening on port ${port}...`));
```

### Environment Variables:
- `process.env.NODE_ENV` returns undefined if not set
- `app.get('env')` returns 'development' if not set
- Want to run middleware for dev experience only on develop to improve production performance