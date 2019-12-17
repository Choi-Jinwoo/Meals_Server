const router = require('express').Router();
const mealCtrl = require('./meal.ctrl');

router.get('/meal/yesterday', mealCtrl.getYestdayMeals);
router.get('/meal/today', mealCtrl.getTodayMeals);
router.get('/meal/tomorrow', mealCtrl.getTomorrowMeals);

module.exports = router;