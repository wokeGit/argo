module.exports = {
  '/api': {
      'target': process.env.ARGO_API_URL || 'http://35.199.167.196', //'http://localhost:8001',
      'secure': false,
  }
};
