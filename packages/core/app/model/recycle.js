/**
 * model: recycle
 * 由 modelGenerator 自动生成，不要修改
 */
'use strict'
const mongooseDelete = require('mongoose-delete')
module.exports = ({ mongoose }) => {
  const Schema = mongoose.Schema
  const recycle = new Schema({
    cid: { type: Schema.Types.ObjectId, index: true },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'user' },
    cname: { type: String },
    content: { type: String },
    aid: { type: Schema.Types.ObjectId, index: true },
  }, {
    minimize: false,
    timestamps: {},
  })
  recycle.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true })
  return mongoose.model('recycle', recycle)
}
