const { Schema, model } = require("mongoose")

const store_payment = new model("store_payment", new Schema({
    author: { type: Schema.Types.ObjectId, ref: "stores"},
    basketId: { type: Schema.Types.String },
    paymentId: { type: Schema.Types.String }
},
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
));

module.exports = store_payment