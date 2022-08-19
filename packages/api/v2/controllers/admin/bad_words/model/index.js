const { model, Schema } = require("mongoose");

const route = new model("black_list", new Schema({
  language: { type: Schema.Types.String, enum:["da","nl","en","fi","fr","de","it","nb","pt","ro","ru","es","sv","tr"] ,default:"tr"},
  words: [{ type: Schema.Types.String }]
},
{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" }}
));

module.exports = route;