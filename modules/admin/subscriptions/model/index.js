const { Schema, model } = require("mongoose")

const route = new model("subscription", new Schema({
    title: { type: Schema.Types.String, enum: ["1Month","3Month","1Year"], required: true },
    description: { type: Schema.Types.String, required: true },
    price: { type: Schema.Types.Number, required: true },
},
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at"}}
));

module.exports = route;