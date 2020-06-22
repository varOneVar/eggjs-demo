'use strict';
const PREFIX = 'room';
module.exports = () => {
  return async (ctx, next) => {
    // 权限校验通过
    ctx.socket.emit('res', 'auth success');
    // 加入房间
    ctx.socket.join(PREFIX);
    // 放行
    await next();
    console.log('断开连接');
  };
};
// module.exports = () => {
//   return async (ctx, next) => {
//     const { app, socket, logger, helper } = ctx;
//     const id = socket.id;
//     const nsp = app.io.of('/');
//     console.log(id, 'socket.id');
//     /**
//      * socket.handshake params
//       {
//         headers: // the headers sent as part of the handshake,
//         time: // the date of creation (as string),
//         address: // the ip of the client,
//         xdomain: // whether the connection is cross-domain,
//         secure: // whether the connection is secure,
//         issued: // the date of creation (as unix timestamp),
//         url: // the request URL string,
//         query: // the query object
//       }
//      */
//     const query = socket.handshake.query;
//     console.log('query', query);
//     // 用户信息
//     const { room, userId } = query;
//     const rooms = [ room ];
//     logger.debug('#user_info', id, room, userId);
//     // 踢人函数
//     const tick = (id, msg) => {
//       logger.debug('#tick', id, msg);
//       // 踢出用户前发送消息
//       socket.emit(id, helper.parseMsg('deny', msg));
//       console.log(nsp, 123123);
//       console.log(nsp.adapter);
//       // 调用adapter方法踢出用户， 客户端触发 disconnect 事件
//       nsp.adapter.remoteDisconnect(id, true, err => {
//         logger.error(err);
//       });
//     };

//     // 检查房间是否存在，不存在则踢出用户
//     const hasRoom = await app.redis.get(`${PREFIX}:${room}`);
//     logger.debug('#has_exist', hasRoom);
//     if (!hasRoom) {
//       // tick(id, {
//       console.log('deleted');
//       //   type: 'deleted',
//       //   message: 'deleted, room has been deleted',
//       // });
//     }

//     // 用户加入
//     logger.debug('#join', room);
//     socket.join(room);

//     // 在线列表
//     nsp.adapter.clients(rooms, (err, clients) => {
//       logger.debug('#online_join', clients);

//       // 更新在线用户列表
//       nsp.to(room).emit('online', {
//         clients,
//         action: 'join',
//         target: 'participator',
//         message: `User${id} joined`,
//       });
//     });

//     await next();

//     // 用户离开
//     logger.debug('#leave', room);

//     // 在线列表
//     nsp.adapter.clients(rooms, (err, clients) => {
//       logger.debug('#online_leave', clients);
//       // 更新在线用户列表
//       nsp.to(room).emit('online', {
//         clients,
//         action: 'leave',
//         target: 'participator',
//         message: `User${id} leaved`,
//       });
//     });
//   };
// };
