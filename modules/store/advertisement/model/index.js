const { Schema, Mongoose, model } = require("mongoose")

const ads = new model("store_ads", new Schema({
    author: { type: Schema.Types.ObjectId, ref: "stores" },
    ads_which: { type: Schema.Types.String, enum:["Banner","Story"],require: true },
    ads_price: { type: Schema.Types.Number, require: true },
    ads_date: { type: Schema.Types.Date, require: true },
    ads_description : { type: Schema.Types.String, require: true },
    img: { type: Schema.Types.String, require: false },
    video: { type: Schema.Types.String, require: false },
    link: { type: Schema.Types.String, require: false },
    banner_story_time: { type: Schema.Types.Date, enum:["1d","5d","1w","5w","1m"],require: false },
    country: { type: Schema.Types.String, require: true },
    city: { type: Schema.Types.String, require: true },
    district: { type: Schema.Types.String, require: true },
    language: { type: Schema.Types.String },
    is_approved: { type: Schema.Types.String, default: "wait" },
    view: { type: Schema.Types.Array },
},
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }}
))

module.exports = ads;