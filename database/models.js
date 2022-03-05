const pool = require('./index.js');


const getReview = async (product_id) => {
  let query1 = `select count(*) from reviews where product_id=$1`

  const results = await pool.query(query1, [product_id])

  return results;
}

module.exports = {getReview}