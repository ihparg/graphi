/**
 * model: recycle
 * 由 modelGenerator 自动生成，不要修改
 */
'use strict'
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
  return mongoose.model('recycle', recycle)
}
