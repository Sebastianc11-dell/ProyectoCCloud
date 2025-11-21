const axios = require('axios');
const env = require('../config/env');

const client = axios.create({
  baseURL: env.mercadolibreBaseUrl,
  timeout: 10000
});

exports.search = async (query = '') => {
  if (!query) {
    return [];
  }
  const { data } = await client.get('/sites/MLA/search', {
    params: { q: query }
  });
  return data.results;
};

exports.getDetail = async (id) => {
  const { data } = await client.get(`/items/${id}`);
  return data;
};
