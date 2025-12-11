"use strict";

const https = require('https');
const env = require('../config/env');
const { AppError } = require('../utils/errorHandler');

const RAPIDAPI_HOST = env.amazon?.host || 'amazon-product-info2.p.rapidapi.com';
const RAPIDAPI_KEY = env.amazon?.key;

const extractAsin = (url = '') => {
  const match = url.match(/\/dp\/([\w\d]{10})/i);
  if (match && match[1]) {
    return match[1];
  }
  const param = url.match(/[?&]asin=([\w\d]{10})/i);
  return param ? param[1] : null;
};

const getAmazonBasicInfo = (productUrl) =>
  new Promise((resolve, reject) => {
    if (!RAPIDAPI_KEY) {
      return reject(new AppError('Amazon API key not configured', 500));
    }
    const encodedUrl = encodeURIComponent(productUrl);
    const options = {
      method: 'GET',
      hostname: RAPIDAPI_HOST,
      path: `/Amazon/details?url=${encodedUrl}`,
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST
      }
    };

    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        try {
          const text = Buffer.concat(chunks).toString();
          const json = JSON.parse(text);

          let body = null;
          if (Array.isArray(json) && json[0]?.body) {
            body = json[0].body;
          } else if (json?.body) {
            body = json.body;
          } else if (json?.data?.body) {
            body = json.data.body;
          }

          if (!body) {
            return reject(new AppError('Invalid response from Amazon API', 502));
          }

          resolve({
            name: body.name,
            price: body.rawPrice ?? body.currentPrice ?? body.price,
            currency: body.currency || 'USD',
            image: body.mainImage || body.image,
            canonicalUrl: body.canonicalURL || body.url || productUrl,
            asin: body.asin || extractAsin(body.canonicalURL || body.url || productUrl)
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });

module.exports = {
  getAmazonBasicInfo,
  extractAsin
};
