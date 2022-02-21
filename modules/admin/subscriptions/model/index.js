const { Schema, model } = require("mongoose")

const route = new model("subscription", new Schema({
    sub_name: { type: Schema.Types.String, enum: ["1Month","3Month","1Year"]},
    sub_description: { type: Schema.Types.String, require: true },
    sub_price: { type: Schema.Types.Number, require: true },
    img: { type: Schema.Types.String, require: true }
},
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at"}}
));

module.exports = route;