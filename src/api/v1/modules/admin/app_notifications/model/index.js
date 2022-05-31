const { Schema , model } = require("mongoose")

const route = new Schema({
    title: { type: Schema.Types.String, maxlength: 200 },
    description: { type: Schema.Types.String, maxlength: 500 ,required: true },
    country: { type: Schema.Types.String, required: true },
    city: { type: Schema.Types.String, required: true },
    district: { type: Schema.Types.String, required: true },
    language: { type: Schema.Types.String, enum:["da","nl","en","fi","fr","de","it","nb","pt","ro","ru","es","sv","tr"],require: true },
},
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at"}}
)
route.index({ country: "text", city:"text", district:"text" , language: "text"})
module.exports = model("app_notification", route);