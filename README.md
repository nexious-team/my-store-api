# my-store-back
This is the API for my-store application one of developers-town project base on online marketing. We use

## Installation 
```
# git clone https://github.com/developers-town/my-store-back.git
# cd my-store-back
# npm install
# npm start
```
## Routes & Endpoint

### CRUD
- GET:    /api/:model       => all documents
- GET:    /api/:model/:id   => get an document by id
- POST:   /api/:model       => create an document
- PUT:    /api/:model/:id   => update an document by id
- DELETE: /api/:model/:id   => delete an document by id

### Query with GET: /api/:model
- Filter by field => GET: /api/:model ? field1Name=field1Value & field2Name=field2Value...
- Select fields => GET: /api/:model ? select[field1Name]=1 & select[field2Name]=1...
- Pagination => GET: /api/:model ? page=1 & limit=20
- Sort => GET: /api/:model ? sort=fieldName & sort=-fieldName

> Space here only for readable purpose!!!

## Features

- Best practice API endpoints
- Filter, sort and pagination within url query
- Control access over resources base on users' roles and permissions
- Minimal file structure

## Documentation

- [Swagger](https://app.swaggerhub.com/apis-docs/developers-town/my-store/1.0.0)
- [GitBook](https://my-store-developers-town.gitbook.io/my-store-back/)

## References

- Express
- Mongoose
- Passport
- JWT
- Accesscontrol
- More+
