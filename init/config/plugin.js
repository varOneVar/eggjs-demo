'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: { // 作用是渲染模板时，使用node_modules里的库可以渲染到public这样的前缀去获取
  //   enable: true,
  // },
  redis: {
    enable: true,
    package: 'egg-redis',
  },
  jwt: {
    enable: true,
    package: 'egg-jwt',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  validate: {
    enable: true,
    package: 'egg-validate',
  },
  bizerror: {
    enable: true,
    package: 'egg-bizerror',
  },
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
    // mongoose global plugins, expected a function or an array of function and options
  },
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
  io: {
    enable: true,
    package: 'egg-socket.io',
  },
};
