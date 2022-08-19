const { Schema, model } = require("mongoose");

const route = new model("store_comment", new Schema({
  store_id: { type: Schema.Types.ObjectId, ref: "stores"},
  author: { type: Schema.Types.ObjectId , ref: "users" },
  comment: { type: Schema.Types.String, require: true},
  rate: { type: Schema.Types.Number, enum:[0,1,2,3,4,5]},
  is_approved: { type: Schema.Types.String, default: "wait" },
},  
{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" }}
));

module.exports = route;