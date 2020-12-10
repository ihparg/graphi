/**
 * model: route
 * 由 modelGenerator 自动生成，不要修改
 */
'use strict'
module.exports = ({ mongoose }) => {
  const Schema = mongoose.Schema
  const route = new Schema({
    tag: { type: String },
    path: { type: String },
    method: { type: String, default: 'GET', enum: [ 'GET', 'POST', 'PUT', 'DELETE' ] },
    description: { type: String },
    routeParams: {},
    queryStrings: {},
    requestHeaders: {},
    requestBody: {},
    responseHeaders: {},
    responseBody: {},
    status: { type: Number, default: 0, enum: [ 0, 1, 2 ] },
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    fullPath: { type: String },
    aid: { type: String, index: true },
    title: { type: String },
    alias: { type: String },
  }, {
    minimize: false,
    timestamps: {},
  })
  return mongoose.model('route', route)
}
