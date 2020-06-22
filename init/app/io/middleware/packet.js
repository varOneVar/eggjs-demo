'use strict';
// 通常用于对消息做预处理，又或者是对加密消息的解密等操作
module.exports = () => {
  return async (ctx, next) => {
    ctx.socket.emit('res', 'packet received!');
    console.log('packet:', ctx.packet);
    await next();
  };
};
