const router = require('express').Router();
const mealCtrl = require('./meal.ctrl');

router.get('/meal', mealCtrl.getMeals);

module.exports = router;