require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app');

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.DB_HOST_TEST, options)
  .then(
    () => { /* console.log('Database connected!'); */ },
    (err) => { console.log(err); },
  );

const port = process.env.PORT || '5050';
app.set('port', port);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
