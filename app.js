const express = require('express');
const bodyParser = require('body-parser');
const search_school = require('./router/searchSchool');
const v1 = require('./router/v1');
const v2 = require('./router/v2');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/search-school', search_school);
app.use('/', v1);
app.use('/v2', v2)

const port = process.env.port || 8080;

app.listen(port, () => {
  console.log(`SERVER is running at ${port}`);
})