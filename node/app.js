const express = require('express');
const app = express();
const port = 8080;

var db = require('./mongodb_setup');

var bodyParser = require('body-parser');

var hbs = require('hbs');
var path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/static', express.static('public'));

app.set('views', path.join(__dirname, 'views'));
// hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
// app.set('view options', { layout: 'layout' });

var test_route = require("./routes/testroute");

app.use("/test", test_route);

app.get('/', (req, res)=> {
  res.send("HELLO");
});

app.listen(port, () => {
  console.log(`start server at http://localhost:${port}`);
});