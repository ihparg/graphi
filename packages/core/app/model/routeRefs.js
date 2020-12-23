/**
 * model: routeRefs
 * 由 modelGenerator 自动生成，不要修改
 */
'use strict'
module.exports = ({ mongoose }) => {
  const Schema = mongoose.Schema
  const routeRefs = new Schema({
    rid: { type: Schema.Types.ObjectId, index: true },
    aid: { type: Schema.Types.ObjectId, index: true },
    refs: [
      { type: Schema.Types.ObjectId },
    ],
  }, {
    minimize: false,
    timestamps: {},
  })
  return mongoose.model('routeRefs', routeRefs)
}
