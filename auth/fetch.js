const fetch = require('isomorphic-unfetch');

const authUrl = process.env.AUTH_URL.replace(/\/$/, '');
const { AUTH_API_KEY } = process.env;

const fetchWithBody = (method) => async (endpoint, data) => {
  const response = await fetch(`${authUrl}/${endpoint}`, {
    method,
    body: JSON.stringify(data),
    headers: {
      Authorization: `Bearer ${AUTH_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  const parsed = await response.json();
  return response.status < 400 ? parsed : { ...parsed, statusCode: response.status };
};

exports.sendPost = fetchWithBody('POST');
exports.sendPut = fetchWithBody('POST');
exports.sendDelete = fetchWithBody('DELETE');
