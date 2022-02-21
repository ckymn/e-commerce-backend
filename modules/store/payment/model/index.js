const { Schema, model } = require("mongoose")

const store_payment = new model("store_payment", new Schema({
    author: { type: Schema.Types.ObjectId, ref: "stores"},
    product_name: { type: Schema.Types.String},
    card_paid_price: { type: Schema.Types.Number, require: true },
    time: { type: Schema.Types.Number, require: true },
    status: { type: Schema.Types.String, default: "running"},
    basketId: { type: Schema.Types.String },
    paymentId: { type: Schema.Types.String },
    buyerName: { type: Schema.Types.String },
    buyerSurname: { type: Schema.Types.String },
    buyerNumber: { type: Schema.Types.String },
    buyerEmail: { type: Schema.Types.String },
    buyerAddress: { type: Schema.Types.String },
    buyerCity: { type: Schema.Types.String },
    buyerCountry: { type: Schema.Types.String },
    ship_name: { type: Schema.Types.String },
    ship_city: { type: Schema.Types.String },
    ship_country: { type: Schema.Types.String },
    ship_address: { type: Schema.Types.String },
    ship_b_name: { type: Schema.Types.String },
    ship_b_city: { type: Schema.Types.String },
    ship_b_country: { type: Schema.Types.String },
    ship_b_address: { type: Schema.Types.String },
    items: { type: Schema.Types.Map}
},
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
));

module.exports = store_payment