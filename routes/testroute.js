var express = require("express");
var router = express.Router();

const test_controller = require("../controller/test_controller");

router.route("/")
  .get(test_controller.get_test4)
  .post(test_controller.create_test4);

router.route("/:id")
  .get(test_controller.test_paramters);  

module.exports = router;