'use strict';
module.exports = app => {
  const prefix = '/user-center/';
  const { router, controller } = app;
  router.post(`${prefix}login`, controller.user.login);
  router.post(`${prefix}register`, controller.user.register);
  router.post(`${prefix}send-verifycode`, controller.user.sendVerifyCode);
  router.post(`${prefix}checktoken`, controller.user.checkToken);
  router.post(`${prefix}token-userinfo`, controller.user.checkToken);
};
