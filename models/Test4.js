var mongoose = require("mongoose");

var Test4Schema = new mongoose.Schema({
  name: String,
});

module.exports = mongoose.model("Test4",Test4Schema);