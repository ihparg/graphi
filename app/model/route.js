/**
 * model: route
 * 由 modelGenerator 自动生成，不要修改
 */
'use strict'
const mongooseDelete = require('mongoose-delete')
module.exports = ({ mongoose }) => {
  const Schema = mongoose.Schema
  const route = new Schema({
  tag: { type: String },
  path: { type: String },
  method: { type: String, default: 'GET', enum: ['GET', 'POST', 'PUT', 'DELETE'] },
  description: { type: String },
  routeParams: {},
  queryStrings: {},
  requestHeaders: {},
  requestBody: {},
  responseHeaders: {},
  responseBody: {},
  status: { type: Number, default: 0, enum: [0, 1, 2] },
  fullPath: { type: String },
  aid: { type: Schema.Types.ObjectId },
  title: { type: String },
  name: { type: String },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'user' },
  resolve: { type: String },
  }, {
    minimize: false,
    timestamps: {},
  })
  route.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true })
  return mongoose.model('route', route)
}