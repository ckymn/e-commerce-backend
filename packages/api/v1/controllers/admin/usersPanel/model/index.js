const { Schema , model} = require("mongoose");

const route = new model("how_i_use", new Schema({
  title: { type: Schema.Types.String, required: true },
  description: { type: Schema.Types.String, required: true },
  link: { type: Schema.Types.String, required: true },
},
{ timestamps: { createdAt: "created_at", updatedAt: "updated_at"}}
));

module.exports = route;