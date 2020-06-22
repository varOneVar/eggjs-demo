'use strict';
const path = require('path');

module.exports = appInfo => {
  const config = exports = {
  };
  config.logger = {
    dir: path.join(appInfo.baseDir, 'logs'),
  };
  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/example',
      options: {},
    },
  };
  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: 'auth',
      db: 0,
    },
  };
};
