const router = require('express').Router();
const meal = require('./meal/meal');

router.get('/meal', meal);

module.exports = router;