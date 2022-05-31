const { Schema, model } = require("mongoose")

const store_payment = new model("store_payment", new Schema({
    author: { type: Schema.Types.ObjectId, ref: "stores"},
    ads_id: { type: Schema.Types.ObjectId, ref: "store_ads"},
    basketId: { type: Schema.Types.String },
    paymentId: { type: Schema.Types.String },
    price: { type: Schema.Types.String },
    paid_price: { type: Schema.Types.String },
    paymentTransactionId: { type: Schema.Types.String , required: true,},
    date: { type: Schema.Types.Date, default: new Date()}
},
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
));

module.exports = store_payment