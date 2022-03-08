const { Mongoose, Schema, model} = require("mongoose");

const store_storie = new Schema({
	author: { type: Schema.Types.ObjectId, ref: "store"},
    type: { type: Schema.Types.String, default: "store_storie"},
	author_img: { type: Schema.Types.String},
	story_time: { type: Schema.Types.Date, default:new Date(+new Date() + 24*60*60*1000) },
	img: [{ type: Schema.Types.String, required: true }],
	video: { type: Schema.Types.String, require: false },
	view: [{ type: Schema.Types.ObjectId, ref:"user" }],
	country: { type: Schema.Types.String, require: true },
	city: { type: Schema.Types.String, require: true },
	district: { type: Schema.Types.String, require: true },
	location: {
		type: {
		  type: Schema.Types.String,
		  default: "Point",
		},
		coordinates: {
		  type: [Schema.Types.Number],
		},
	  },
	language: { type: Schema.Types.String, enum:["da","nl","en","fi","fr","de","it","nb","pt","ro","ru","es","sv","tr"],require: true },
},
	{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
)
store_storie.index({ location: "2dsphere"})
module.exports = new model("store_storie",store_storie);