/**
 * model: routeRefs
 * 由 modelGenerator 自动生成，不要修改
 */
'use strict'
const mongooseDelete = require('mongoose-delete')
module.exports = ({ mongoose }) => {
  const Schema = mongoose.Schema
  const routeRefs = new Schema({
    rid: { type: Schema.Types.ObjectId },
    aid: { type: Schema.Types.ObjectId },
    refs: [
      { type: Schema.Types.ObjectId },
    ],
  }, {
    minimize: false,
    timestamps: {},
  })
  routeRefs.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true })
  return mongoose.model('routeRefs', routeRefs)
}
