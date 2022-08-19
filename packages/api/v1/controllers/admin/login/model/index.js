const { Schema, Mongoose, model } = require("mongoose");

const admin_login = new model("admins", new Schema({
  email : { type: Schema.Types.String, required: true },
  username: { type: Schema.Types.String, require: true ,unique: true },
  password : { type: Schema.Types.String, required: true },
  img: { type: Schema.Types.String, require: false },
  active: [{ type: Schema.Types.ObjectId }],
  code: { type: Schema.Types.String, default: "" },
  role : { type: Schema.Types.Array, required: true, default: "admin"},
  menu_permissions: { type: Schema.Types.Array },
},
{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" }}
));

module.exports = admin_login; 