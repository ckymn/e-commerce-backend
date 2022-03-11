const { Schema , model } = require("mongoose");

const ads =  new Schema({
    author: { type: Schema.Types.ObjectId, ref: "stores" },
    ads_which: { type: Schema.Types.String, enum:["Banner","Story"],required: true },
    ads_time: { type: Schema.Types.String,required: true },
    ads_price: { type: Schema.Types.Number, required: true },
    phone: { type: Schema.Types.String, required: true },
    is_approved: { type: Schema.Types.String, default:"wait"}
},
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }}
);
module.exports = new model("store_ads", ads);
