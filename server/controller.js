const {getReview} = require('../database/models.js');
const pool = require('../database/index.js')

module.exports = {
  getReviews: async (req, res) => {
    const { product_id } = req.query;
    try {
      const results = await getReview(product_id)
        let response =  {
          product: product_id,
          count: results.rows.length,
          results: results.rows
        }
        res.send(response)
    }
    catch (err) {
      console.log(err)
      res.send(err)
    }
  }
}