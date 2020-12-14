const express = require('express');
const app = express();
const port = 8080;

var db = require('./mongodb_setup');

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var test_route = require("./routes/testroute");

app.use("/test", test_route);

app.get('/', (req, res)=> {
  res.send("HELLO");
});

app.listen(port, () => {
  console.log(`start server at http://localhost:${port}`);
});