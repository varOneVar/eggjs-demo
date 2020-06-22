'use strict';

const Controller = require('egg').Controller;

class NspController extends Controller {
  async index() {
    const { app, socket } = this.ctx;
    const id = socket.id;
    const nsp = app.io.of('/');
    // 根据id给指定连接发送消息
    nsp.sockets[id].emit('res', 'hello ....');
    // 指定房间连接信息列表
    nsp.adapter.clients([ 'room' ], (err, clients) => {
      console.log(JSON.stringify(clients));
    });
    //  给指定房间的每个人发送消息
    nsp.to('room').emit('online', this.ctx.socket.id + '上线了');
    // 断开连接
    this.ctx.socket.disconnect();
  }
  async exchange() {
    const { ctx, app } = this;
    const nsp = app.io.of('/');
    console.log(ctx.args, 'ctx.args');
    const message = ctx.args[0] || {};
    const socket = ctx.socket;
    const client = socket.id;
    try {
      const { target, payload } = message;
      if (!target) return;
      const msg = ctx.helper.parseMsg('exchange', payload, { client, target });
      nsp.emit(target, msg);
    } catch (error) {
      app.logger.error(error);
    }
  }
}

module.exports = NspController;
