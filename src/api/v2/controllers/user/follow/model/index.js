const { Schema, model } = require("mongoose")

const route = new model("store_follow", new Schema({
    store_id: { type: Schema.Types.ObjectId, ref: "stores"},
    author: { type: Schema.Types.ObjectId },
}));

module.exports = route;