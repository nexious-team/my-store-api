require('dotenv').config();

const mongoose = require('mongoose');
const data = require('./json/init.json');
const permissions = require('./json/permissions.json');
const Models = require('./models');

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.DB_HOST_TEST, options)
  .then(
    async () => {
      console.log('Database connected!');
      // clear
      await Models.staff.deleteMany({});
      await Models.user.deleteMany({});
      await Models.permission.deleteMany({});
      // insert
      await Models.staff.create(data.admin); // password=admin123
      await Models.user.create(data.user); // password=user123
      await Models.permission.create(permissions);
      console.log('Done.');
      process.exit(0);
    },
    (err) => { console.log(err); },
  );
