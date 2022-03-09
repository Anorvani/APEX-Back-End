const {getReview, postReview, getMetaData, helpfulReview, reportReview} = require('../database/models.js');
const pool = require('../database/index.js')

module.exports = {
  getReviews: async (req, res) => {
    const { product_id, page, count, sort } = req.query;
    try {
      const results = await getReview(product_id, page, count, sort)
        let response =  {
          product: product_id,
          page: page,
          count: count,
          results: results.rows[0].results
        }
        res.send(response)
    }
    catch (err) {
      console.log(err.message)
      res.send(err.message)
    }
  },

  postReviews: async (req, res) => {
    const review = {...req.body}
    let currentUnixDate = Math.round((new Date()).getTime()/1000)

    try {
      await postReview(review, currentUnixDate)
      res.status(200).send('Review Posted')
    }
    catch(err) {
      res.send(err.message, 'Error in posting review')
    }
  },

  getMeta: async (req, res) => {
    const { product_id } = req.query;
    try {
      const results = await getMetaData(product_id);
      // let response = {
      //   product_id,
      //   results: results.rows[0]
      // }
      res.send(results.rows[0])
    }
    catch (err) {
      res.send(err.message)
    }
  },

  helpfulReviews: async (req, res) => {
    const {review_id} = req.params;
    try {
      await helpfulReview(review_id);
      res.send('updated')
    }
    catch(err) {
      res.send(err.message)
    }
  },

  reportedReview: async (req, res) => {
    const {review_id} = req.params;
    try {
      await reportReview(review_id);
      res.send('reported')
    }
    catch(err) {
      res.send(err.message)
    }
  }
}