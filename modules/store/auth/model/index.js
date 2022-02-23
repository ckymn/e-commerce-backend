const { Schema, model } = require("mongoose")

const store_register = new Schema(
  {
    name: { type: Schema.Types.String, require: true },
    surname: { type: Schema.Types.String, require: true },
    email: { type: Schema.Types.String, require: true, unique: true },
    phone: { type: Schema.Types.String, require: true, unique: true },
    username: { type: Schema.Types.String, require: true, unique: true },
    storeimg: { type: Schema.Types.String, require: true },
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
    storelanguage: { type: Schema.Types.String, required: true },
    storecountry: { type: Schema.Types.String, require: true },
    storecity: { type: Schema.Types.String, require: true },
    storedistrict: { type: Schema.Types.String, require: true },
    storeneighborhood: { type: Schema.Types.String, require: true },
    storestreet: { type: Schema.Types.String, require: false },
    storebuildingnumber: { type: Schema.Types.String, require: true },
    storedoornumber: { type: Schema.Types.String, require: true },
    storename: { type: Schema.Types.String, require: true },
    instagram: { type: Schema.Types.String, require: false },
    experience: { type: Schema.Types.String, require: true },
    remain_date: { type: Schema.Types.Number, default: 0 },
    sector_name: { type: Schema.Types.String, require: true },
    is_approved: { type: Schema.Types.String, default: "wait" },

    comment: [{ type: Schema.Types.ObjectId, ref: "store_comment" }],
    star: [{ type: Schema.Types.ObjectId, ref: "store_star" }],
    follow: [{ type: Schema.Types.ObjectId, ref: "users" }],
    view: [
      {
        who: {
          type: Schema.Types.ObjectId,
          ref: "users",
        },
        date: {
          type: Schema.Types.Date,
        },
      },
    ],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
store_register.index({ location: "2dsphere"});
module.exports = new model("stores", store_register)
