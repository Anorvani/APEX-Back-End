// import http from 'k6/http';
// import { sleep } from 'k6';

// export default function () {
//   http.get('https://test.k6.io');
//   sleep(1);
// }

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';

export const requests = new Counter('http_reqs');

export const options = {
  vus: 200,
  duration: '60s',
};

const randomNumber = (max, min) => (
  Math.floor(Math.random() * (max - 1 + min) + min)
);
let count = randomNumber(100000, 1);
// const url = `http://localhost:8080/api/reviews/?product_id=${count}`;
const url = `http://localhost:3000/api/reviews/meta?product_id=${count}`;
// const url = `http://localhost:8080/api/reviews?review_id=${count}/helpful`;
// const url = `http://localhost:8080/api/reviews?review_id=${count}/report`;

export default function () {
  const res = http.get(url);
  sleep(0.1);
  check(res, {
    'status was 200': (r) => r.status === 200,
    'transaction time< 200ms': (r) => r.timings.duration < 200,
    'transaction time< 500ms': (r) => r.timings.duration < 500,
    'transaction time< 1000ms': (r) => r.timings.duration < 1000,
    'transaction time< 2000ms': (r) => r.timings.duration < 2000,
  });
  count = randomNumber(100000, 1);
}