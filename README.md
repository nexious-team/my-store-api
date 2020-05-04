# my-store-api
This is the API for my-store application, one of developers-town project base on online marketing.

## Installation
```
# git clone https://github.com/nexious-team/my-store-api.git
# cd my-store-api
# npm install
# npm start
```
## Endpoints

### User or Staff
- POST: /api/:user/signup         => user registration # { first_name, last_name, username, email, password, ... }
- GET:  /api/:user/verify-email   => user verify email # ?token
- POST: /api/:user/login          => user login        # { email, password }
- GET:  /api/:user/profile        => get user's profile
- PUT:  /api/:user/profile        => update user's profile
- POST:  /api/:user/avatar        => upload avatar # { avatar: (file) }
- GET:  /api/:user/calls          => get api request history
- POST: /api/:user/reset-password => user reset password # { email }
- PUT: /api/:user/reset-password  => user reset password # { password }

### User Single Sign-On Authentication
- GET: /api/users/auth                   => verify user with API after sso authentication # ?token
- GET: /api/user/auth/facebook           => redirect to Facebook login page
- GET: /api/user/auth/facebook/callback  => authenticated result from Facebook
- GET: /api/user/auth/google             => redirect to Google login page
- GET: /api/user/auth/google/callback    => authenticated result from Google

### Recycle
- POST: /api/recycle/restore/:id        => Restore deleted document by recycle id
- POST: /api/recycle/restore/:model/:id => Restore deleted document by modelName and document id

### CRUD
- GET:    /api/:model       => get all documents
- GET:    /api/:model/:id   => get a document by id
- POST:   /api/:model       => create a document
- PUT:    /api/:model/:id   => update an document by id
- DELETE: /api/:model/:id   => delete an document by id

### Util
- GET: /api/:model/count  => number of documents in the collection
- GET: /api/:model/schema => schema of model

### Populate
- GET: /api/:model/populate       => get all documents with embed reference fields
- GET: /api/:model/:id/populate   => get one document with embed reference fields
- GET: /api/:model/populate/:reference     => get all documents with embed specific reference field
- GET: /api/:model/:id/populate/:reference => get one document with embed specific reference field

### File
- POST: /api/files?/upload => upload file # { file: (file) }

### Query with GET: /api/:model
- Filter by field => GET: /api/:model ? field1Name=field1Value & field2Name=field2Value...
- Select fields   => GET: /api/:model ? select[field1Name]=1 & select[field2Name]=1...
- Pagination      => GET: /api/:model ? page=1 & limit=20
- Sort            => GET: /api/:model ? sort=fieldName & sort=-fieldName

## Features

- Best practice API endpoints
- Filter, sort and pagination within url query
- Control access over resources base on users' roles and permissions
- Minimal file structure

## Documentation

- [Swagger](https://app.swaggerhub.com/apis-docs/nexious/my-store/1.0.0)
- [GitBook](https://my-store-developers-town.gitbook.io/my-store-back/)

## Getting started

### Add new model
Give a definition schema in a new file at /models, then create mongoose model in /models/index.js

### Use routers
Mount routers for new resource (model) by add an json object at /routes/config.json
```json
  {
    "endpoint": "users?",
    "model": "user",
    "routers": ["user", "common"]
  }
```
 * Mountable routers stay at /routes/routers

### Create new routers
Or create an new router to mount on a specific resource (model):
- Create a new file at /routes/routers/
- instance an router from express.Router()
- implement desire routes within the router instance, then export the router
- mount to resoures in /routes/config.json

## References

- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [Passport](http://www.passportjs.org/)
- [JWT](https://jwt.io/)
- [Accesscontrol](https://onury.io/accesscontrol/?api=ac)
- [Nodemailer](https://nodemailer.com/about/)
- [More+](/package.json)
