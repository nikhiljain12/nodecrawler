const fs = require('fs');
const path = require('path');
const readline = require('readline');
const request = require('request-promise-native');
const cheerio = require('cheerio');
const url = require('url');

const rl = readline.createInterface({
  input: fs.createReadStream(
    path.join(__dirname, 'seedUrls.txt')),
  crlfDelay: Infinity
});

rl.on('line', (seedUrl) => {
  request(seedUrl)
    .then(function parseLinks(body) {
      const $ = cheerio.load(body);
      let links = $('a');
      $(links).each(function(i, link) {
        let href = $(link).attr('href');
        if (!href) return;
        if (!href.startsWith('http')) {
          href = new url.URL(href, seedUrl).toString();
        }
        console.log(href);
      });
    })
    .catch( (err) => {console.log(err)})
});