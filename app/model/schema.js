/**
 * model: schema
 * 由 modelGenerator 自动生成，不要修改
 */
'use strict'
module.exports = ({ mongoose }) => {
  const Schema = mongoose.Schema
  const schema = new Schema({
    name: { type: String },
    description: { type: String },
    deletedAt: { type: Date },
    content: {},
    tag: { type: String },
    aid: { type: String, index: true },
  }, {
    minimize: false,
    timestamps: {},
  })
  return mongoose.model('schema', schema)
}
