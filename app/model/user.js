/**
 * model: user
 * 由 modelGenerator 自动生成，不要修改
 */
'use strict'
const mongooseDelete = require('mongoose-delete')
module.exports = ({ mongoose }) => {
  const Schema = mongoose.Schema
  const user = new Schema({
    password: { type: String },
    email: { type: String },
    status: { type: Number, enum: [ 0, 1 ] },
    role: { type: Number, default: 0, enum: [ 0, 1, 2 ] },
    tokens: [
      {
        token: { type: String },
        createdAt: { type: Date },
      },
    ],
    name: { type: String },
    phone: { type: String },
    lastLoginAt: { type: Date },
  }, {
    minimize: false,
    timestamps: {},
  })
  user.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true })
  return mongoose.model('user', user)
}
