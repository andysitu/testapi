var express = require("express");
var router = express.Router();

const test_controller = require("../controller/test_controller");

router.route("/")
  .get(test_controller.show_users);

router.route('/get_users')
  .get(test_controller.get_users)

router.route("/transfer_users")
  .get(test_controller.transfer_users);

router.route("/:id")
  .get(test_controller.test_paramters)
  .patch(test_controller.edit_user);

module.exports = router;