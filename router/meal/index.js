const router = require("express").Router();
const meal = require("./meal");

router.get("/", meal);

module.exports = router;