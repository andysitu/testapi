var UserTest = require("../models/UserTest");

// var jquery = require('jquery');

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


module.exports.test_paramters = test_paramters;
module.exports.transfer_users = transfer_users;
module.exports.get_users = get_users;
module.exports.show_users = show_users;
module.exports.edit_user = edit_user;

async function show_users(req, res) {
  var users = await UserTest.find({});

  res.render("users", {users: users});
}

async function get_users(req, res) {
  var users = await UserTest.find({}).limit(100);
  res.status(200).json(users);
}

async function edit_user(req, res) {
  var id = req.params.id;
  console.log(id);
  console.log(req.body);
  res.status(200).json({});
}

async function test_paramters(req, res) {
  console.log(req.params.id);
  console.log(req.query.fire);
  res.status(200).send();
}

// 
async function transfer_users(req, res) {
  console.log("hi");

  var xhr = new XMLHttpRequest();

  xhr.addEventListener('load', async function(e){
    const userdata = JSON.parse(this.responseText).results;
    
    console.log(userdata.length);

    var user;
    for (var i=0; i < userdata.length; i++) {
      user = new UserTest();
      user.email = userdata[i].email;
      user.name_title = userdata[i].name.title;
      user.name_first = userdata[i].name.first;
      user.name_last = userdata[i].name.last;
      user.phone = userdata[i].phone;
      await user.save();
    }
    res.status(200).send();
  });

  // GET 1000
  xhr.open('GET', 'https://randomuser.me/api?results=1000');
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send();
  res.status(200).send();
}