'use strict';
const dayjs = require('dayjs');
module.exports = {
  randomNum(len) {
    len = len || 32;
    const $chars = '123456789';
    const maxPos = $chars.length;
    let randomStr = '';
    for (let i = 0; i < len; i++) {
      randomStr += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return randomStr;
  },
  dateFormat(date = new Date(), format = 'YYYY/MM/DD') {
    const time = new Date(date);
    if (isNaN(Date.parse(time))) return;
    return dayjs(time).format(format);
  },
  // 设置access_token
  async setAccessTokenFN(userId) {
    const token = this.app.jwt.sign({
      _id: userId,
    },
    this.app.config.jwt.secret, {
      expiresIn: '30d',
    });
    const key = `ACCESS_TOKEN:${userId}`;
    await this.app.redis.set(key, `${token}:${Date.now()}`, 'ex', 12 * 60 * 60);
    return token;
  },
  // 验证access_token
  async verifyAccessTokenFN(token) {
    let dataGet;
    try {
      dataGet = this.app.jwt.verify(token, this.app.config.jwt.secret);
    } catch (error) {
      this.ctx.throwBizError('Invalid_Token', error);
    }
    if (dataGet && dataGet._id) {
      const key = `ACCESS_TOKEN:${dataGet._id}`;
      const T = await this.app.redis.get(key);
      if (T) {
        const [ code ] = T.split(':');
        if (code === token) {
          // 续时间
          await this.app.redis.set(key, T, 'ex', 12 * 60 * 60);
          return dataGet._id;
        }
      }
    }
    return false;
  },
  parseMsg(action, payload = {}, metadata = {}) { // 包装io信息
    const meta = Object.assign({}, {
      timestamp: Date.now(),
    }, metadata);
    return {
      meta,
      data: {
        action,
        payload,
      },
    };
  },
};
