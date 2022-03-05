const express = require('express')
const router = express.Router();
const axios = require('axios');
const {getReviews} = require('./controller.js');

const server = express();

router.route('/reviews')
  .get(getReviews)

router.route('/reviews/meta')


module.exports = router;