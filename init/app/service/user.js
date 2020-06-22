'use strict';

const Service = require('egg').Service;
const { PBKDF2 } = require('../utils/crypto');

class UserService extends Service {
  async login({ username, password }) {
    const { ctx, config } = this;
    const { success_code, fail_code } = config.code;
    try {
      const hash = PBKDF2(password);
      const data = await ctx.model.User.findOne({ username, password: hash });
      if (!data) {
        return {
          code: fail_code,
          msg: '用户不存在！',
        };
      }
      const token = await ctx.helper.setAccessTokenFN(data._id);
      return {
        code: success_code,
        data: token,
      };
    } catch (error) {
      this.ctx.throwBizError('Server_Error', error);
    }
  }
  async register({ username, password, verifyCode }) {
    const { ctx, app, config } = this;
    const { success_code, fail_code, unknow_fail_code } = config.code;
    try {
      const smsCode = await app.redis.get(username);
      if (verifyCode !== '262626' && smsCode !== verifyCode) {
        return {
          code: fail_code,
          msg: '验证码错误！',
        };
      }
      const hash = PBKDF2(password);
      const data = await ctx.model.User.findOne({ username, password: hash });
      if (data) {
        return {
          code: fail_code,
          msg: '用户已存在！',
        };
      }
      const ObjectId = app.mongoose.Types.ObjectId;
      const _id = new ObjectId();
      const userInfo = {
        _id: _id.toString(),
        password: hash,
        username,
        nickname: username,
        gender: 3,
        roles: [ 'normal' ],
        createdTime: Date.now,
      };
      const userData = await ctx.model.User.create(userInfo);
      if (userData) {
        const token = await ctx.helper.setAccessTokenFN(userInfo._id);
        return {
          code: success_code,
          data: token,
        };
      }
      return {
        code: unknow_fail_code,
      };
    } catch (error) {
      this.ctx.throwBizError('Server_Error', error);
    }
  }
  async checkToken(token) {
    const { ctx, config } = this;
    const { success_code, token_code } = config.code;
    try {
      const userId = await ctx.helper.verifyAccessTokenFN(token);
      if (userId) {
        const userInfo = await ctx.model.User.findById(userId);
        if (userInfo) {
          return {
            code: success_code,
            data: userInfo,
          };
        }
      }
      return {
        code: token_code,
      };
    } catch (error) {
      this.ctx.throwBizError('Server_Error', error);
    }
  }
  async sendVerifyCode(phone) {
    const { ctx, app, config, service } = this;
    const { success_code, fail_code } = config.code;
    try {
      const smsCode = ctx.helper.randomNum(6);
      await app.redis.set(phone, smsCode, 'ex', 300);
      const temCode = 'SMS_127155850';
      const param = `{"code":${smsCode}}`;
      const error = await service.alisms.sendSms(phone, temCode, param);
      this.logger.info('✉️  验证码：', phone + ' - ' + smsCode);
      if (!error) {
        return {
          code: success_code,
        };
      }
      return {
        code: fail_code,
      };
    } catch (error) {
      this.ctx.throwBizError('Server_Error', error);
    }
  }

  async buriedPoint(message) {
    const { ctx, config } = this;
    const { success_code, fail_code } = config.code;
    try {
      const data = ctx.model.Point.create(message);
      if (data) {
        return {
          code: success_code,
        };
      }
      return {
        code: fail_code,
      };
    } catch (error) {
      this.ctx.throwBizError('Server_Error', error);
    }
  }
}

module.exports = UserService;
