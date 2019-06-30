const express = require('express');
const cores = require('./config.json');
const Routers = require('./routers');

module.exports = (app) => {
  cores.forEach(core => {
    const router = express.Router();

    core.routers.forEach(name => {
      const params =  core.params ? core.params[name] : undefined;
      router.use( Routers[name] (core.model, params) );
    });

    app.use('/api/' + core.endpoint, router)
  })
}
