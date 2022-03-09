const express = require('express')
const router = express.Router();
const axios = require('axios');
const {getReviews, postReviews, getMeta, helpfulReviews, reportedReview} = require('./controller.js');

const server = express();

router.route('/reviews')
  .get(getReviews)
  .post(postReviews)

router.route('/reviews/meta')
  .get(getMeta)

router.route('/reviews/:review_id/helpful')
  .put(helpfulReviews)

router.route('/reviews/:review_id/report')
  .put(reportedReview)

module.exports = router;