'use strict';

module.exports = () => {
  return async (ctx, next) => {
    // if (true) {
    //   ctx.socket.disconnect();
    //   return;
    // }
    await next();
    console.log('disconnection!');
  };
};
