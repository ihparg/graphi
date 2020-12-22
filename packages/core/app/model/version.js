/**
 * model: version
 * 由 modelGenerator 自动生成，不要修改
 */
'use strict'
const mongooseDelete = require('mongoose-delete')
module.exports = ({ mongoose }) => {
  const Schema = mongoose.Schema
  const version = new Schema({
  routes: [
   {},
  ],
  schemas: {},
  aid: { type: Schema.Types.ObjectId, index: true },
  createdBy: { type: String },
  description: { type: String },
  tag: { type: String, index: true },
  }, {
    minimize: false,
    timestamps: {},
  })
  version.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true })
  return mongoose.model('version', version)
}