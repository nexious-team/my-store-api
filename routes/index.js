const express = require('express');
const cores = require('./index.json');
const Routers = require('./routers');

module.exports = (app) => {
  cores.forEach(core => {
    const router = express.Router();
    core.routers.forEach(r => {
      router.use(Routers[r](core.model, core.features))
    });
    app.use('/api/' + core.endpoint, router)
  })
}
