'use strict';
module.exports = app => {
  const { router, controller } = app;
  router.post('/upload_file/one', controller.file.uploadOneFileForFile);
  router.post('/upload_file/multip', controller.file.uploadMultipFileForFile);
  router.post('/upload_stream/one', controller.file.uploadOneFileForStream);
  router.post('/upload_stream/multip', controller.file.uploadMultipFileForStream);
  router.post('/download-file', controller.file.downloadFile);
};
