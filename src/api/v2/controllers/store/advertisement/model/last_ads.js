const { Schema, Mongoose, model } = require("mongoose")

const ads = new Schema({
    author: { type: Schema.Types.ObjectId, ref: "stores" },
    type: { type: Schema.Types.String, default: "store_ads"},
    ads_which: { type: Schema.Types.String, enum:["Banner","Story"],required: true },
    ads_time: { type: Schema.Types.String, enum:["1d","5d","1w","2w","1m"],required: true },
    banner_story_time: { type: Schema.Types.Date, require: false, default: new Date(+new Date()+24*3600*1000) },
    ads_price: { type: Schema.Types.Number, require: true },
    ads_description : { type: Schema.Types.String, require: true },
    img: [{ 
      _id: { type: Schema.Types.String },
      url: { type: Schema.Types.String },
    }],
    video:[{ 
      _id: { type: Schema.Types.String },
      url: { type: Schema.Types.String },
    }],
    link: { type: Schema.Types.String, require: false },
    country: { type: Schema.Types.String, require: true },
    city: { type: Schema.Types.String, require: true },
    district: { type: Schema.Types.String, require: true },
    is_approved: { type: Schema.Types.String, default: "wait" },
    authCode: { type: Schema.Types.String, default: ""},
    view:[{ 
      who: { type: Schema.Types.ObjectId, ref:"user" },
      date: { type: Schema.Types.Date, default: new Date() }
    }],
    location: {
        type: {
          type: Schema.Types.String,
          default: "Point",
        },
        coordinates: {
          type: [Schema.Types.Number],
        },
    },
    language: { type: Schema.Types.String, enum:["da","nl","en","fi","fr","de","it","nb","pt","ro","ru","es","sv","tr"],require: true },
},
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }}
)
ads.index({ location: "2dsphere"})
module.exports = new model("store_ads", ads);