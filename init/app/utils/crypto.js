'use strict';

const CryptoJS = require('crypto-js');

function JsonFormatter() {
  return {
    stringify(cipherParams) {
      // create json object with ciphertext
      const jsonObj = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) };
      // optionally add iv or salt
      if (cipherParams.iv) {
        jsonObj.iv = cipherParams.iv.toString();
      }
      if (cipherParams.salt) {
        jsonObj.s = cipherParams.salt.toString();
      }
      // stringify json object
      return JSON.stringify(jsonObj);
    },
    parse(jsonStr) {
      // parse json string
      const jsonObj = JSON.parse(jsonStr);
      // extract ciphertext from json object, and create cipher params object
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct),
      });
      // optionally extract iv or salt
      if (jsonObj.iv) {
        cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv);
      }
      if (jsonObj.s) {
        cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s);
      }
      return cipherParams;
    },
  };
}
module.exports = {
  PBKDF2(message) { // 不可逆 keySize控制长度
    const salt = '6114ea1898e90b9b1244489c3e74ed38';
    const key512Bits1000Iterations = CryptoJS.PBKDF2(message, salt, {
      keySize: 125 / 32,
      iterations: 1000,
    });
    return key512Bits1000Iterations.toString();
  },
  MD5(message) { // MD5加密 不可逆
    const salt = '510acb5e0b80ed9b861b72d9bf50adcb';
    const hash = CryptoJS.MD5(salt + message);
    return CryptoJS.MD5(salt + hash).toString();
  },
  aesEncrypted(message) { // AES加密
    // 一个对象
    // {
    //   ct: "tZ4MsEnfbcDOwqau68aOrQ==",
    //   iv: "8a8c8fd8fe33743d3638737ea4a00698",
    //   s: "ba06373c8f57179c"
    // };
    const salt = 'e31dd5f210a6a6e2a36a80ab1c6a6b44';
    const encrypted = CryptoJS.AES.encrypt(message, salt, {
      format: JsonFormatter(),
    });
    return encrypted;
  },
  aesDecrypted(encrypted) { // AES解密
    const salt = 'e31dd5f210a6a6e2a36a80ab1c6a6b44';
    const decrypted = CryptoJS.AES.decrypt(encrypted, salt, {
      format: JsonFormatter(),
    });
    return decrypted;
  },
};
