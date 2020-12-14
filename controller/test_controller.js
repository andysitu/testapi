var Test4 = require("../models/Test4");

module.exports.get_test4 = get_test4;
module.exports.create_test4 = create_test4;
module.exports.test_paramters = test_paramters;

async function get_test4(req, res) {
  res.status(200).json({"message": "hello"});
}

async function create_test4(req, res) {
  console.log(req.body);
  res.status(200).send();
}

async function test_paramters(req, res) {
  console.log(req.params.id);
  console.log(req.query.fire);
  res.status(200).send();
}