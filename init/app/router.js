'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, io } = app;

  router.get('/', 'home.index');

  // socket.io
  io.of('/').route('exchange', io.controller.nsp.index);

  require('./routes/file')(app);
  require('./routes/user')(app);

};
