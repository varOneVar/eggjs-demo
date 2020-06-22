'use strict';

const Controller = require('egg').Controller;

const USER_INFO = {
  username: {
    type: 'string',
    required: true,
    format: /^\d{11}$/,
  },
  password: {
    type: 'string',
    required: true,
    min: 6,
    max: 20,
  },
};

class UserController extends Controller {
  async login() {
    const { body } = this.ctx.request;
    try {
      this.ctx.validate(USER_INFO, body);
    } catch (error) {
      this.ctx.throwBizError('Validation_Failed', error);
    }
    try {
      const result = await this.service.user.login({
        username: body.username.trim(),
        password: body.password.trim(),
      });
      this.ctx.body = result;
    } catch (error) {
      this.ctx.throwBizError('Server_Error', error);
    }
  }
  async register() {
    const { body } = this.ctx.request;
    const registerinf = {
      ...USER_INFO,
      verifyCode: {
        type: 'string',
        format: /^\d{6}$/,
      },
    };
    try {
      this.ctx.validate(registerinf, body);
    } catch (error) {
      this.ctx.throwBizError('Validation_Failed', error);
    }
    try {
      const result = await this.service.user.register({
        username: body.username.trim(),
        password: body.password.trim(),
        verifyCode: body.verifyCode.trim(),
      });
      this.ctx.body = result;
    } catch (error) {
      this.ctx.throwBizError('Server_Error', error);
    }
  }
  async sendVerifyCode() {
    const { body } = this.ctx.request;
    const paramsValidate = {
      mobile: {
        type: 'string',
        format: /^\d{11}$/,
      },
    };
    try {
      this.ctx.validate(paramsValidate, body);
    } catch (error) {
      this.ctx.throwBizError('Validation_Failed', error);
    }
    try {
      const phone = body.mobile.trim();
      const result = await this.service.user.sendVerifyCode(phone);
      this.ctx.body = result;
    } catch (error) {
      this.ctx.throwBizError('Server_Error', error);
    }
  }
  async checkToken() {
    const { body } = this.ctx.request;
    const paramsValidate = {
      token: 'string',
    };
    try {
      this.ctx.validate(paramsValidate, body);
    } catch (error) {
      this.ctx.throwBizError('Validation_Failed', error);
    }
    try {
      const token = body.token.trim();
      const result = await this.service.user.checkToken(token);
      this.ctx.body = result;
    } catch (error) {
      this.ctx.throwBizError('Server_Error', error);
    }
  }
}

module.exports = UserController;
