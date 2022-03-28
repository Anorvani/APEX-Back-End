const pool = require('./index.js');

const getReview = async (product_id, page, count, sort) => {
  let sorter;
  switch (sort) {
    case 'newest':
      sorter = 'date ASC';
      break;
    case 'helpful':
      sorter = 'helpfulness DESC';
      break;
    default:
      sorter = 'helpfulness DESC, date ASC';
      break;
  }
  let query1 = `select json_build_object
    ('review_id', review_id, 'rating', rating, 'summary', summary, 'recommended', recommended, 'response', response, 'body', body, 'date', (to_timestamp(date/1000)::date), 'reviewer_name', reviewer_name, 'helpfulness', helpfulness,
    'photos', (select coalesce (array_agg(json_build_object('id', photo_id, 'url', url)), '{}')
    as photos from photos where reviews.review_id = photos.review_id))
    from reviews where (product_id=$1) and (reported=false) order by ${sorter} LIMIT $2 OFFSET ${count * page - count}`;

  const results = await pool.query(query1, [product_id, count])

  return results;
}

const postReview = async (
  {
    product_id,
    rating,
    summary,
    body,
    recommended,
    reviewer_name,
    reviewer_email,
    photos,
    characteristics
  }, currentUnixDate) => {
    await pool.query(
      `INSERT INTO reviews
      (product_id, rating, date, summary, body, recommended, reviewer_name, reviewer_email)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING review_id`
    , [product_id, rating, currentUnixDate, summary, body, recommended, reviewer_name, reviewer_email])
    .then(async ({ rows }) => {
        const review_id = rows[0].review_id;
        try {
          if (photos.length > 0) {
            await photos.forEach(photo => {
              pool.query(`INSERT into reviews_photos (review_id, photo_url) VALUES ($1, $2)`, [review_id, photo])
            })
          }
          for (let [characteristic, rating] of Object.entries(characteristics)) {
            await pool.query(`INSERT INTO characteristic_review (characteristic_id, review_id, value) VALUES ($1, $2, $3)`, [characteristic, review_id, rating])
          }
          console.log('success')
        }
        catch (err) {
          console.log(err, 'error posting review')
        }
      }
    )
  }

  const getMetaData = async (product_id) => {

    const results = await pool.query(`SELECT reviews.product_id,
    (SELECT json_build_object(
      1, (SELECT count(*) filter (where rating = 1)),
      2, (SELECT count(*) filter (where rating = 2)),
      3, (SELECT count(*) filter (where rating = 3)),
      4, (SELECT count(*) filter (where rating = 4)),
      5, (SELECT count(*) filter (where rating = 5))
      ))
      AS ratings,
    (SELECT (json_build_object(
    true, count(recommended) filter (where recommended = true),
    false, count(recommended) filter (where recommended = false)
    )))
      AS recommendeded,
      (SELECT json_object_agg(name,
        json_build_object('id', characteristics.char_id,
        'value', (SELECT CAST(avg(value) AS TEXT) FROM characteristic_review WHERE characteristic_review.characteristic_id = characteristics.char_id)))
        AS characteristics FROM characteristics
        JOIN characteristic_review ON characteristics.char_id = characteristic_review.cr_id AND reviews.product_id = characteristics.product_id)
    FROM reviews
  WHERE reviews.product_id = $1
  GROUP BY reviews.product_id`, [product_id])

    return results
  }

const helpfulReview = async (review_id) => {
  await pool.query(`
    update reviews
    set helpfulness = helpfulness + 1
    where reviews.review_id = $1
  `, [review_id])
}

const reportReview = async (review_id) => {
  await pool.query(`
    update reviews
    set reported = true
    where reviews.review_id = $1
  `, [review_id])
}

module.exports = {getReview, postReview, getMetaData, helpfulReview, reportReview}