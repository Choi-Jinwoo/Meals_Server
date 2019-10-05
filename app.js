const express = require("express");
const bodyParser = require("body-parser");
const search_school = require("./router/searchSchool");
const meal = require("./router/meal");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use("/search-school", search_school);
app.use("/meal", meal);

app.listen(3000, () => {
    console.log("server is running at port 3000");
})