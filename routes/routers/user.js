const express = require('express');
const { user: User } = require('../../models');

module.exports = () => {
  const router = express.Router();

  router.post('/signup', (req, res, next) => {
    User.create(req.body, (err, user) => {
      if(err) next(err);
      res.json(user);
    })
  })

  router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    User.findOne({email}, (err, doc) => {
      if(err) next(err);
      console.log({doc, compare: doc.compare(password)});
      if(!doc.compare(password)) return res.json("Unpair email/password");
      res.json(doc);
    })
  })

  return router;
}
