/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
const { CODE, codeMsg } = require('./errorList');
const path = require('path');
const os = require('os');

module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {
    code: CODE,
    codeMsg,
  };
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '5d56afc55b379f14c4a7418bba05099c';
  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.tpl': 'nunjucks',
    },
  };
  config.io = {
    init: { }, // passed to engine.io
    namespace: {
      '/': {
        connectionMiddleware: [ 'auth' ],
        packetMiddleware: [],
      },
      '/chat': {
        connectionMiddleware: [],
        packetMiddleware: [],
      },
    },
  };
  config.multipart = {
    mode: 'stream',
    tmpdir: path.join(os.tmpdir(), 'egg-multipart-tmp', appInfo.name), // os.tmpdir()会获取临时文件目录， tmp代表临时文件 temporary
    fields: 20, // 表单上传字段限制的个数
    fileSize: '50mb', // 文件上传的大小限制
    fileModeMatch: /\/upload_file\//, // 支持mode类型为file的上传，接口前缀必须是prefix_file, stream与file共存
    fileExtensions: [ '.xls', '.xlsx', '.png', '.jpg', '.jpeg', '.zip' ], // 扩展几种上传的文件格式
    cleanSchedule: { // 清除任务
      // run tmpdir clean job on every day 04:30 am
      // cron style see https://github.com/eggjs/egg-schedule#cron-style-scheduling
      cron: '0 30 4 * * *',
    },
  };
  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [ 'http://localhost:6465' ],
  };
  config.static = {
    maxAge: 12 * 60 * 60,
  };
  config.cors = {
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    credentials: true,
  };
  config.aliyun = {
    sms: {
      AccessKeyId: 'LTAIc6k9ReHxxEqO',
      AccessKeySecret: '2viXbEpcve9VFxBbGRYSZ7EPSkYglu',
      SignName: '米牛',
      SmsId: 'SMS_127155850',
    },
  };
  config.jwt = {
    secret: 'f6d9a9c0762a9bff86e4d23206029167',
  };
  config.logger = {
    dir: path.join(appInfo.baseDir, 'logs', appInfo.name),
  };
  config.logrotator = {
    maxDays: 10, // 日志文件最多保存天数
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
      password: '',
      db: 0,
    },
  };
  config.errorHandler = {
    enable: true,
  };
  // add your middleware config here
  // 加载数据是个洋葱模型，想象一下洋葱的横切面。从左到右执行（左外->右外->右内->左内），以await next()区分内外，上面逻辑为外，下面逻辑为内
  // 执行顺序： test1 next上  --> test2 next上 ---> test3 next上 ---> route next上--> controller之类的逻辑 --> route next下 ---> test3 next下 ---> test2 next下 ---> test1 next下
  // 路由中的中间件排在配置文件之后， 和加载顺序有关，router排序垫底
  // await next()上的逻辑会在controller数据处理逻辑之前，await next()下会在controller数据处理逻辑之后
  config.middleware = [ 'error', 'auth' ];
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
