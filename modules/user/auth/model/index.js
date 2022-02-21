const { Schema, Mongoose, model } = require("mongoose")

const user_login = new model("users", new Schema({
    email : { type: Schema.Types.String, require: true },
    username: { type: Schema.Types.String, require: true },
    password : { type: Schema.Types.String, require: true },
    language: { type: Schema.Types.String, require: true },
    country: { type: Schema.Types.String, require: true },
    city: { type: Schema.Types.String, require: true },
    district: { type: Schema.Types.String, require: true },
    img: { type: Schema.Types.String, require: false },
    follow: [{ type: Schema.Types.ObjectId, ref: "stores" }],
    favorite_product: [{ type: Schema.Types.ObjectId, ref: "products" }],
    store_comment: [{ type: Schema.Types.ObjectId, ref:"store_comment" }],
    product_comment: [{ type: Schema.Types.ObjectId, ref:"product_comment" }],
	role : { type: Schema.Types.String, required: true, default: "user" },
},
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }}
))
    
module.exports = user_login;