'use strict';
const path = require('path');

module.exports = appInfo => {
  const config = exports = {
  };
  config.logger = {
    dir: path.join(appInfo.baseDir, 'logs'),
  };
  config.mongoose = {
    host: 'santak_mongo',
    username: 'root',
    password: 'Aa123456',
    client: {
      url: 'mongodb://127.0.0.1/santak_mongo',
      options: {},
    },
  };
  config.redis = {
    client: {
      port: 6379, // Redis port
      host: 'santak_redis', // Redis host
      password: 'Aa123456',
      db: 0,
    },
  };
};
