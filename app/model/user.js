/**
 * model: user
 * 由 modelGenerator 自动生成，不要修改
 */
'use strict'
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
  return mongoose.model('user', user)
}
