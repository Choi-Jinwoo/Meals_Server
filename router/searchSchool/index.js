const router = require('express').Router();
const search_school = require('./search-school');

router.get('/', search_school);

module.exports = router;