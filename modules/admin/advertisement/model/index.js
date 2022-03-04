const { Schema, Mongoose, model } = require("mongoose")

const admin_ads = new model("admins_story_ads", new Schema({
    ads_time: { type: Schema.Types.String,enum:["1d","5d","1w","2w","1m"], required: true },
    ads_which: { type: Schema.Types.String, enum:["Banner","Story"],required: true },
    banner_story_time: { type: Schema.Types.Date, require: false, default: new Date(+new Date()+24*3600*1000) },
    ads_description : { type: Schema.Types.String, require: true },
    img: [{ type: Schema.Types.String, require: false }],
    video: { type: Schema.Types.String, require: false },
    link: { type: Schema.Types.String, require: false },
    country: { type: Schema.Types.String, require: true },
    city: { type: Schema.Types.String, require: true },
    district: { type: Schema.Types.String, require: true },
    language: { type: Schema.Types.String, enum:["da","nl","en","fi","fr","de","it","nb","pt","ro","ru","es","sv","tr"],require: true },
    view: [{ type: Schema.Types.ObjectId, ref:"user" }],
},
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }}
))

module.exports = admin_ads;