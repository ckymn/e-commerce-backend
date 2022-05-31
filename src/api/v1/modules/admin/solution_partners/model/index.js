const { Schema, model } = require("mongoose")

const route = new model("solution_partner", new Schema({
    partner_category: { type: Schema.Types.String, enum:["Kargocu", "Fotografci"], require: true },
    partner_phone: { type: Schema.Types.String, require: true },
    partner_sector: { type: Schema.Types.String, enum:["Tasimacilik", "Fotogracilik"],require: true},
    partner_description: { type: Schema.Types.String, require: true },
    partner_price: { type: Schema.Types.Number, require: true },
    partner_country: { type: Schema.Types.String, require: true },
    partner_city: { type: Schema.Types.String, require: true },
    partner_district: { type: Schema.Types.String, require: true },
	partner_language: { type: Schema.Types.String, enum:["da","nl","en","fi","fr","de","it","nb","pt","ro","ru","es","sv","tr"],require: true },
},
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }}
));

module.exports = route;
