'use strict';
module.exports = () => {
  return async function(ctx, next) {
    try {
      await next();
      if (ctx.body && ctx.body.code) {
        if (!ctx.body.data) {
          ctx.body.data = null;
        }
        if (!ctx.body.msg) {
          ctx.body.msg = ctx.app.config.codeMsg(ctx.body.code);
        }
      }
    } catch (err) {
      const { code, codeMsg } = ctx.app.config;
      // 所有异常都在app上触发一个error事件，框架会记录一条错误日志
      ctx.app.emit('error', err, ctx);
      const status = err.status || 500;
      // 生产环境时， 500 错误详细内容不返还客户端
      const error = status === 500 && ctx.app.config.env === 'prod'
        ? 'Internal Server Error'
        : err.message;
      ctx.body = { error };
      // 客户端传递的参数异常
      if (status === 422) {
        ctx.body = {
          code: code.params_validate,
          msg: codeMsg(code.params_validate),
          errors: err.errors,
        };
      }
      ctx.status = status;
      // token无效
      if (status === 430) {
        ctx.status = 200;
        ctx.body = {
          code: code.token_code,
          error: codeMsg(code.token_code),
        };
      }
    }
  };
};
