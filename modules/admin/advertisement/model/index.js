const { Schema, Mongoose, model } = require("mongoose")

const admin_ads = new model("admins_ads", new Schema({
    ads_which: { type: Schema.Types.String, enum:["Banner","Story"],require: true },
    ads_date: { type: Schema.Types.Date, require: true },
    ads_description : { type: Schema.Types.String, require: true },
    img: { type: Schema.Types.String, require: false },
    video: { type: Schema.Types.String, require: false },
    link: { type: Schema.Types.String, require: false },
    banner_story_time: { type: Schema.Types.Number, require: false },
    country: { type: Schema.Types.String, require: true },
    city: { type: Schema.Types.String, require: true },
    district: { type: Schema.Types.String, require: true },
    language: { type: Schema.Types.String, require: true },
    view: { type: Schema.Types.Array },
},
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }}
))

module.exports = admin_ads;