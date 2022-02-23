const { Schema, model } = require("mongoose")

const Product_Star = new model("product_star", new Schema({
    store_id: { type: Schema.Types.ObjectId, ref:"store"},
    product_id : { type: Schema.Types.ObjectId, ref: "product" },
    author: { type: Schema.Types.ObjectId, ref: "user" },
    rate: { type: Schema.Types.Number, enum: [1,2,3,4,5] }
},
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }}
));

const Store_Star = new model("store_star", new Schema({
    store_id: { type: Schema.Types.ObjectId, ref:"store" },
    author: { type: Schema.Types.ObjectId, ref: 'user' },
    rate: { type: Schema.Types.Number, enum:[1,2,3,4,5] }
},
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }}
));

module.exports = { Product_Star, Store_Star };