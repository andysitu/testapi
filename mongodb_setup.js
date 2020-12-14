var mongoose = require('mongoose');

mongoose.connect(
  'mongodb://usera:password@localhost:27017/test?authSource=admin',
{ useNewUrlParser: true });

module.exports = mongoose;