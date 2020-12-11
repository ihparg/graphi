/**
 * model: schema
 * 由 modelGenerator 自动生成，不要修改
 */
'use strict'
const mongooseDelete = require('mongoose-delete')
module.exports = ({ mongoose }) => {
  const Schema = mongoose.Schema
  const schema = new Schema({
  name: { type: String },
  description: { type: String },
  deletedAt: { type: Date },
  content: {},
  tag: { type: String },
  aid: { type: String, index: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'user' },
  }, {
    minimize: false,
    timestamps: {},
  })
  schema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true })
  return mongoose.model('schema', schema)
}