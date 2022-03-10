const {getReview, postReview, getMetaData, helpfulReview, reportReview} = require('../database/models.js');
const pool = require('../database/index.js')

module.exports = {
  getReviews: async (req, res) => {
    //const {page, count, sort = "relevant", product_id } = req.query;
    const { product_id } = req.query;
    const count = req.query.count || 5;
    const page = req.query.page || 1;
    const sort = req.query.sort || 'relevant';
    try {
      const results = await getReview(product_id, page, count, sort)
        let response =  {
          product: product_id,
          page: page,
          count: results.rows.length,
          results: results.rows.map(row => {return row.json_build_object})
        }
        res.status(200).send(response)
    }
    catch (err) {
      console.log(err.message)
      res.status(404).send(err.message)
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
      res.status(404).send(err.message, 'Error in posting review')
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
      res.status(200).send(results.rows[0])
    }
    catch (err) {
      res.status(404).send(err.message)
    }
  },

  helpfulReviews: async (req, res) => {
    const {review_id} = req.params;
    try {
      await helpfulReview(review_id);
      res.status(200).send('updated')
    }
    catch(err) {
      res.status(404).send(err.message)
    }
  },

  reportedReview: async (req, res) => {
    const {review_id} = req.params;
    try {
      await reportReview(review_id);
      res.status(200).send('reported')
    }
    catch(err) {
      res.status(404).send(err.message)
    }
  }
}