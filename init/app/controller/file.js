'use strict';

const Controller = require('egg').Controller;
const path = require('path');
const sendToWormhole = require('stream-wormhole');
const pump = require('pump');
const fs = require('fs');
const { MD5 } = require('../utils/crypto');
const mkdirp = require('mkdirp');
const glob = require('glob');
const promisify = require('promisify-node');
const mime = require('mime'); // 获取扩展对应的content-type


class FileController extends Controller {
  async checkFilePath(path) {
    try {
      fs.accessSync(path, fs.constants.W_OK);
    } catch (error) {
      await mkdirp(path);
    }
  }
  async uploadOneFileForStream() {
    const { ctx } = this;
    // file not required
    const stream = await ctx.getFileStream({ requireFile: false });
    let result;
    if (stream.filename) {
      // 文件名，实际项目中文件名要添加时间戳
      const filename = stream.filename.toLowerCase();
      const dirname = ctx.helper.dateFormat();
      // 检查目录是否可写入，不可则创建目录
      await this.checkFilePath(path.join(this.config.baseDir, 'upload', dirname));
      // 上传的目录，注意upload目录要存在，实际项目中以云服务器地址为准，入库要替换地址符号
      result = path.join(this.config.baseDir, 'upload', dirname, `${MD5(filename)}${path.extname(filename)}`);

      const writeStream = fs.createWriteStream(result);
      try {
        await pump(stream, writeStream);
      } catch (error) {
        // must consume the empty stream
        await sendToWormhole(stream);
        writeStream.destroy && writeStream.destroy();
        this.ctx.throwBizError('Server_Error', error);
      }
    } else {
      // must consume the empty stream
      await sendToWormhole(stream);
    }
    if (result) {
      ctx.body = {
        code: this.config.code.success_code,
        data: result,
      };
    } else {
      ctx.body = {
        code: this.config.code.fail_code,
        msg: '未上传任何文件！',
      };
    }
  }
  // 多文件流上传
  async uploadMultipFileForStream() { // 多文件流上传
    const { ctx } = this;
    const parts = ctx.multipart();
    const files = [];
    let part;
    while ((part = await parts()) != null) {
      if (part.length) {
        // arrays are busboy fields
        console.log('field: ' + part[0]);
        console.log('value: ' + part[1]);
        console.log('valueTruncated: ' + part[2]);
        console.log('fieldnameTruncated: ' + part[3]);
        this.ctx.body = {
          code: this.config.code.unknow_fail_code,
          msg: '该上传数据提交方式暂不支持！请使用key/value的方式添加FormData数据！',
        };
      } else {
        if (!part.filename) {
          // user click `upload` before choose a file,
          // `part` will be file stream, but `part.filename` is empty
          // must handler this, such as log error.
          continue;
        }
        // 文件名，实际项目中文件名要添加时间戳
        const filename = part.filename.toLowerCase();
        // 文件表单的name
        const fieldname = part.fieldname;
        const dirname = ctx.helper.dateFormat();
        // 检查目录是否可写入，不可则创建目录
        await this.checkFilePath(path.join(this.config.baseDir, 'upload', dirname));
        // 上传的目录，注意upload目录要存在，实际项目中以云服务器地址为准，入库要替换地址符号
        const target = path.join(this.config.baseDir, 'upload', dirname, `${MD5(filename)}${path.extname(filename)}`);

        const writeStream = fs.createWriteStream(target);
        try {
          await pump(part, writeStream);
        } catch (error) {
          // 如果出现错误，关闭管道
          await sendToWormhole(part);
          writeStream.destroy && writeStream.destroy();
          this.ctx.throwBizError('Server_Error', error);
        }
        files.push({
          [fieldname]: target,
        });
      }
    }
    if (files.length) {
      this.ctx.body = {
        code: this.config.code.success_code,
        data: files,
      };
    } else {
      ctx.body = {
        code: this.config.code.fail_code,
        msg: '未上传任何文件！',
      };
    }

  }
  // 多文件file上传
  async uploadMultipFileForFile() {
    const { ctx } = this;
    console.log('got %d files', ctx.request.files.length);
    const files = [];
    for (const file of ctx.request.files) {
      try {
        // 读取文件
        const FILE = fs.readFileSync(file.filepath); // files[0]表示获取第一个文件，若前端上传多个文件则可以遍历这个数组对象
        // 文件名，实际项目中文件名要添加时间戳
        const filename = file.filename.toLowerCase();
        // 检查目录是否可写入，不可则创建目录
        const dirname = ctx.helper.dateFormat();
        await this.checkFilePath(path.join(this.config.baseDir, 'upload', dirname));
        // 上传的目录，注意upload目录要存在，实际项目中以云服务器地址为准，入库要替换地址符号
        const result = path.join(this.config.baseDir, 'upload', dirname, `${MD5(filename)}${path.extname(filename)}`);
        fs.writeFileSync(result, FILE);
        files.push(result);
      } catch (error) {
        this.ctx.throwBizError('Server_Error', error);
      } finally {
        // remove tmp files and don't block the request's response
        // cleanupRequestFiles won't throw error even remove file io error happen
        ctx.cleanupRequestFiles([ file ]);
      }
    }
    if (files.length) {
      ctx.body = {
        code: this.config.code.success_code,
        data: files,
      };
    } else {
      ctx.body = {
        code: this.config.code.fail_code,
        msg: '未上传任何文件！',
      };
    }
  }
  // 单文件file上传
  async uploadOneFileForFile() {
    const { ctx } = this;
    const file = ctx.request.files[0];
    let result;
    try {
      console.log(file, file.filepath, 998);
      // process file or upload to cloud storage
      // 读取文件
      const FILE = fs.readFileSync(file.filepath); // files[0]表示获取第一个文件，若前端上传多个文件则可以遍历这个数组对象
      // 将文件存到指定位置
      // 文件名，实际项目中文件名要添加时间戳
      const filename = file.filename.toLowerCase();
      // 检查目录是否可写入，不可则创建目录
      const dirname = ctx.helper.dateFormat();
      await this.checkFilePath(path.join(this.config.baseDir, 'upload', dirname));
      // 上传的目录，注意upload目录要存在，实际项目中以云服务器地址为准，入库要替换地址符号
      result = path.join(this.config.baseDir, 'upload', dirname, `${MD5(filename)}${path.extname(filename)}`);
      fs.writeFileSync(result, FILE);
    } catch (error) {
      this.ctx.throwBizError('Server_Error', error);
    } finally {
      // remove tmp files and don't block the request's response
      // cleanupRequestFiles won't throw error even remove file io error happen
      ctx.cleanupRequestFiles();
      // remove tmp files before send response
      // await ctx.cleanupRequestFiles();
    }
    if (result) {
      ctx.body = {
        code: this.config.code.success_code,
        data: result,
      };
    } else {
      ctx.body = {
        code: this.config.code.fail_code,
        msg: '未上传任何文件！',
      };
    }
  }
  async downloadFile() {
    const { ctx } = this;
    const params = {
      time: {
        type: 'string',
      },
    };
    try {
      ctx.validate(params);
    } catch (error) {
      this.ctx.throwBizError('Validation_Failed', error);
    }
    const date = ctx.helper.dateFormat(ctx.request.body.time);
    try {
      const result = await promisify(glob)(path.join(this.config.baseDir, 'upload', date, '*.xls'));
      if (result && result.length) {
        const file = result[0];
        const fileInfo = await promisify(fs.stat)(file);
        const ext = path.extname(file);
        ctx.attachment(file);
        ctx.set('content-length', fileInfo.size);
        ctx.set('content-type', mime.getType(ext));
        ctx.set('Access-Control-Expose-Headers', 'Content-Disposition');
        ctx.body = fs.createReadStream(file);
        return;
      }
      ctx.body = {
        code: this.config.code.fail_code,
        msg: '找不到文件',
      };
    } catch (error) {
      this.ctx.throwBizError('Server_Error', error);
    }
  }
}

module.exports = FileController;
