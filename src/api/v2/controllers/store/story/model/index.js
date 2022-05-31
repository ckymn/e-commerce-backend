const { Mongoose, Schema, model} = require("mongoose");

const store_storie = new Schema({
	author: { type: Schema.Types.ObjectId, ref: "store"},
    type: { type: Schema.Types.String, default: "store_storie"},
	author_img: { type: Schema.Types.String},
	story_time: { type: Schema.Types.Date, default:new Date(+new Date() + 24*60*60*1000) },
	img:[{ 
		_id: { type: Schema.Types.String },
		url: { type: Schema.Types.String },
	}],
	video: { type: Schema.Types.String, require: false , default:""},
	view: [{ type: Schema.Types.ObjectId, ref:"user" }],
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