const express = require('express');
const cores = require('./index.json');
const Routers = require('./routers');

module.exports = (app) => {
  cores.forEach(core => {
    const router = express.Router();
    core.uses.forEach(use => {
      router.use(Routers[use](core.model))
    });
    app.use('/api/' + core.resource, router)
  })
}
