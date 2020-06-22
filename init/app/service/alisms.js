'use strict';
const Service = require('egg').Service;
const SMSClient = require('@alicloud/sms-sdk');

class AlismsService extends Service {
  sendSms(phone, temCode, param) {
    const accessKeyId = this.config.aliyun.sms.AccessKeyId;
    const secretAccessKey = this.config.aliyun.sms.AccessKeySecret;
    const signName = this.config.aliyun.sms.SignName;
    const smsClient = new SMSClient({
      accessKeyId,
      secretAccessKey,
    });
    return new Promise((resolve, reject) => {
      smsClient.sendSMS({
        SignName: signName,
        PhoneNumbers: phone,
        TemplateCode: temCode,
        TemplateParam: param,
      }).then(function(res) {
        const {
          Code,
        } = res;
        if (Code === 'OK') {
          // 处理返回参数
          console.log(res);
          resolve();
        }
      }, function(err) {
        console.log(err);
        reject(err);
      });
    });
  }

}
module.exports = AlismsService;
