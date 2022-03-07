const { Schema, model } = require("mongoose")

const route = new model("product_comment", new Schema({
    product_id: { type: Schema.Types.ObjectId, ref: "products"},
    author: { type: Schema.Types.ObjectId , ref: "users"},
    author_name: { type: Schema.Types.String },
    comment: { type: Schema.Types.String, require: true},
    rate: { type: Schema.Types.Number, enum:[0,1,2,3,4,5]},
    is_approved: { type: Schema.Types.String, default: "wait" },
},  
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }}
));

module.exports = route