'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const UserSchema = new Schema({
    username: { type: String }, // 手机号注册， 用户名即手机号
    password: { type: String },
    realName: { type: String }, // 身份证名称
    nickName: { type: String }, // 昵称
    IDcard: { type: String }, // 身份证
    gender: { type: Number }, // 性别， 1是男性， 2是女性， 3保密
    roles: { type: Array }, // 角色身份，默认 ['normal']
  });
  return mongoose.model('User', UserSchema);
};
