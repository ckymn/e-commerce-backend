const { Schema, Mongoose, model } = require("mongoose")

const user_login = new Schema({
    email : { type: Schema.Types.String, require: true },
    username: { type: Schema.Types.String, require: true , unique: true },
    password : { type: Schema.Types.String, require: true },
    language: { type: Schema.Types.String, enum:["da","nl","en","fi","fr","de","it","nb","pt","ro","ru","es","sv","tr"],require: true },
    location: {
        type: {
          type: Schema.Types.String,
          default: "Point",
        },
        coordinates: {
          type: [Schema.Types.Number],
        },
      },
    country: { type: Schema.Types.String, require: true },
    city: { type: Schema.Types.String, require: true },
    district: { type: Schema.Types.String, require: true },
    follow: [{ type: Schema.Types.ObjectId, ref: "stores" }],
    favorite_product: [{ type: Schema.Types.ObjectId, ref: "products" }],
    store_comment: [{ type: Schema.Types.ObjectId, ref:"store_comment" }],
    product_comment: [{ type: Schema.Types.ObjectId, ref:"product_comment" }],
	  role : { type: Schema.Types.String, required: true, default: "user" },
    code: { type: Schema.Types.String, default:"" },
},
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }}
)
user_login.index({ location: "2dsphere" })
module.exports = new model("users", user_login)