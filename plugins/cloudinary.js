const cloudinary = require('cloudinary').v2;
const { logger } = require('../routes/routers/helpers');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploads = (file) => new Promise((resolve, reject) => {
  cloudinary.uploader.upload(file, { resource_type: 'auto' }, (err, result) => {
    if (err) {
      logger.log('error', `Error upload to cloudinary: ${err}`);
      reject(err);
    } else {
      resolve({ url: result.secure_url, id: result.public_id });
    }
  });
});
