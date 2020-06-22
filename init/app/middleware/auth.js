'use strict';

module.exports = () => {
  return async (ctx, next) => {
    const { path, headers } = ctx.request;
    const { code, codeMsg } = ctx.app.config;
    const token = headers.authorization;
    const judge = token && await ctx.helper.verifyAccessTokenFN(token);
    // 路由不是login或者register或notauth的地址且token校验未通过
    if (!(/\/(user-center|notauth)/.test(path)) && !judge) {
      ctx.body = {
        code: code.token_code,
        msg: codeMsg(code.token_code),
      };
      ctx.status = 200;
    } else {
      await next();
    }
  };
};
