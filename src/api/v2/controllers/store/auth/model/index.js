const { Schema, model } = require("mongoose")

const store_register = new Schema(
  {
    name: { type: Schema.Types.String, required: true },
    surname: { type: Schema.Types.String, require: true },
    email: { type: Schema.Types.String, require: true, unique: true },
    phone: { type: Schema.Types.String, require: true, unique: true },
    username: { type: Schema.Types.String, require: true, unique: true },
    description: { type: Schema.Types.String, required: true, },
    storeimg: [{ 
      _id: { type: Schema.Types.String },
      url: { type: Schema.Types.String },
    }],
    password: { type: Schema.Types.String, require: true },
    resetCode: { type: Schema.Types.String, require: true, default: "" },
    role: { type: Schema.Types.String, require: true, default: "store" },
    location: {
      type: {
        type: Schema.Types.String,
        default: "Point",
      },
      coordinates: {
        type: [Schema.Types.Number],
      },
    },
    storelanguage: { type: Schema.Types.String, enum:["da","nl","en","fi","fr","de","it","nb","pt","ro","ru","es","sv","tr"],require: true },
    storecountry: { type: Schema.Types.String, require: true },
    storecity: { type: Schema.Types.String, require: true },
    storedistrict: { type: Schema.Types.String, require: true },
    storeneighborhood: { type: Schema.Types.String, require: false },
    storestreet: { type: Schema.Types.String, require: false },
    storebuildingnumber: { type: Schema.Types.String, require: true },
    storedoornumber: { type: Schema.Types.String, require: true },
    storename: { type: Schema.Types.String, required: true, unique: true },
    instagram: { type: Schema.Types.String, require: false },
    experience: { type: Schema.Types.String, require: true },
    remain_date: { 
      created_at : { type: Schema.Types.Date, default: new Date() },
      updated_at : { type: Schema.Types.Date },
      time: { type: Schema.Types.Number, default: 30}, 
    },
    sector_name: { type: Schema.Types.String, required: true },
    store_open_hour: { type: Schema.Types.Number },
    store_close_hour: { type: Schema.Types.Number },
    code: { type: Schema.Types.String, default: "" },
    is_approved: { type: Schema.Types.String, default: "wait" },

    comment: [{ type: Schema.Types.ObjectId, ref: "store_comment" }],
    star: [{ type: Schema.Types.ObjectId, ref: "store_star" }],
    follow: [{ type: Schema.Types.ObjectId, ref: "users" }],
    is_follow: { type: Schema.Types.Boolean, default: false },
    search_count: {
      1: {
        type: Schema.Types.Number,default: 0,
      },
      2: {
        type: Schema.Types.Number,default:0
      },
      3: {
        type: Schema.Types.Number,default:0
      },
      4: {
        type: Schema.Types.Number,default:0
      },
      5: {
        type: Schema.Types.Number,default:0
      },
      6: {
        type: Schema.Types.Number,default:0
      },
      7: {
        type: Schema.Types.Number,default:0
      },
    },
    location_search_count: {
      1: {
        type: Schema.Types.Number,default: 0,
      },
      2: {
        type: Schema.Types.Number,default:0
      },
      3: {
        type: Schema.Types.Number,default:0
      },
      4: {
        type: Schema.Types.Number,default:0
      },
      5: {
        type: Schema.Types.Number,default:0
      },
      6: {
        type: Schema.Types.Number,default:0
      },
      7: {
        type: Schema.Types.Number,default:0
      },
    },
    wp_msg_count: {
      1: {
        type: Schema.Types.Number,default: 0,
      },
      2: {
        type: Schema.Types.Number,default:0
      },
      3: {
        type: Schema.Types.Number,default:0
      },
      4: {
        type: Schema.Types.Number,default:0
      },
      5: {
        type: Schema.Types.Number,default:0
      },
      6: {
        type: Schema.Types.Number,default:0
      },
      7: {
        type: Schema.Types.Number,default:0
      },
    },
    view: [{ type: Schema.Types.ObjectId }],
    last_views_weekly: [{ type: Schema.Types.ObjectId }],
    last_views_monthly: [{ type: Schema.Types.ObjectId }],
    counter_weekly: { type: Schema.Types.Date , default: new Date()},
    counter_monthly: { type: Schema.Types.Date , default: new Date()},
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
store_register.index({ location: "2dsphere", storename: "text" });
module.exports = new model("stores", store_register)
