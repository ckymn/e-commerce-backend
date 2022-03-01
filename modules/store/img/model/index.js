const { model, Schema } = require("mongoose")

const route = new model("store_images", new Schema({
    author: { type: Schema.Types.ObjectId, ref: "store" },
    url: { type: Schema.Types.String, required: true },
},
    { timestamps: { createdAt: "created_at", updatedAt:"updated_at"}}
));

module.exports = route;