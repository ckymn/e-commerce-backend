const { Schema , model } = require("mongoose")

const route = model("app_notification", new Schema({
    title: { type: Schema.Types.String, maxlength: 100 },
    desc: { type: Schema.Types.String, required: true },
    country: { type: Schema.Types.String, required: true },
    city: { type: Schema.Types.String, required: true },
    district: { type: Schema.Types.String, required: true }
},
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at"}}
));

module.exports = route