const express = require('express');
const router = express.Router();

const axios = require('axios');
const db = require('../util/database');
const apiUrl = 'https://api.datamuse.com/words?ml=';
const tables = ['affiliate', 'marketing', 'influencer'];

router.get('/fetch-tweets', (req, res) => {
  axios.all([
    axios.get(`${apiUrl}affiliate`),
    axios.get(`${apiUrl}marketing`),
    axios.get(`${apiUrl}influencer`)
  ])
    .then(axios.spread((affiliate, marketing, influencer) => {
      const wordsArray = [affiliate.data, marketing.data, influencer.data];
      for (let i in wordsArray) {
        executeQuery(wordsArray[i], tables[i]);
      }
      res.send('loading complete');
    }))
});

function executeQuery(array, table) {
  array.forEach(element => {
    db.execute(`INSERT INTO ${table} (word) VALUES (?)`, [element.word]);
  });
}

router.get('/tweet-report', (req, res) => {
  db.execute(
    `select (SELECT COUNT (word) FROM affiliate) as affiliateCount,
            (SELECT COUNT (word) FROM marketing) as marketingCount,
            (SELECT COUNT (word) FROM influencer) as influencerCount`, )
    .then(summary => {
      res.json(summary[0]);
    })
});

module.exports = router;
