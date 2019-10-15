const express = require("express");
const bodyParser = require("body-parser");
const search_school = require("./router/searchSchool");
const meal = require("./router/meal");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/search-school", search_school);
app.use("/meal", meal);
app.use('/', (req, res) => { return res.send("Express Server") });

const port = process.env.port || 8080;

app.listen(port, () => {
    console.log(process.env.port);
    console.log(process.env.key);
    console.log(`SERVER is running at ${port}`);
})