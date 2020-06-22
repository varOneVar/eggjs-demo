'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const PointSchema = new Schema({
    userId: { type: String },
    pointName: { type: String },
    path: { type: String },
    desc: { type: String },
    createTime: { type: Date },
    ext: { type: Object },
  });
  return mongoose.model('Point', PointSchema);
};
