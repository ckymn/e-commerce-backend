const { Schema, Mongoose, model } = require("mongoose")

const route = new model("admin_banner", new Schema({
    bnr_name: { type: Schema.Types.String, require: true },
    bnr_description : { type: Schema.Types.String, require: true },
    img: { type: Schema.Types.String, require: false },
    video: { type: Schema.Types.String, require: false },
    link: { type: Schema.Types.String, require: false },
    bnr_time: { type: Schema.Types.String, enum: ["30m","1h","5h","1d","5d","1w"],require: false },
    country: { type: Schema.Types.String, require: true },
    city: { type: Schema.Types.String, require: true },
    district: { type: Schema.Types.String, require: true },
    language: { type: Schema.Types.String , require: true },
},
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }}
))

module.exports = route;
