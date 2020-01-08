const express = require('express');
const fs = require('fs');
const marked = require('marked');
const path = require('path');
const cores = require('./config.json');
const Routers = require('./routers');
const { logger } = require('./routers/helpers');

module.exports = (app) => {
  /* GET home page will render README.md */
  app.get('/', (req, res, next) => {
    const filePath = path.join(__dirname, '../README.md');

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (!err) {
        res.send(marked(data.toString()));
      } else {
        logger.error(err);
      }
    });
  });

  cores.forEach((core) => {
    const router = express.Router();

    core.routers.forEach((name) => {
      const params = core.params ? core.params[name] : undefined;
      router.use(Routers[name](core.model, params));
    });

    app.use(`/api/${core.endpoint}`, router);
  });
};
