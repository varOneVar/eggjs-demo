'use strict';

module.exports = {
  Validation_Failed: {
    status: 422,
    message: '参数校验失败',
  },
  Server_Error: {
    status: 500,
    message: '服务端异常',
  },
  Invalid_Token: {
    status: 430,
    message: 'Token无效',
  },
};
