'use strict';

const CODE = {
  success_code: '0',
  fail_code: '1',
  unknow_fail_code: '2',
  params_validate: '3',
  token_code: '-110',
  login_code: '-111',
  user_exit_code: '-112',
};

const codeMsg = code => {
  const codeStr = {
    [CODE.success_code]: '操作成功！',
    [CODE.fail_code]: '操作失败！',
    [CODE.unknow_fail_code]: '未知错误！',
    [CODE.params_validate]: '参数校验失败！',
    [CODE.token_code]: 'Token已失效！',
    [CODE.login_code]: '登录失败！请检查账号密码是否正确',
    [CODE.user_exit_code]: '用户已存在！',
  };
  return codeStr[code];
};

module.exports = {
  CODE,
  codeMsg,
};
