var mongoose = require("mongoose");

var Test4Schema = new mongoose.Schema({
  email: String,
  phone: String,
  name_title: String,
  name_first: String,
  name_last: String,
});

module.exports = mongoose.model("Test4",Test4Schema);