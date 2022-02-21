const { Mongoose, Schema, model} = require("mongoose");

const route = new model("admin_storie", new Schema({
	author: { type: Schema.Types.ObjectId, ref: "admin"},
	author_img: { type: Schema.Types.String},
	story_time: { type: Schema.Types.Date ,enum:["1d","5d","1w","5w","1m"] , require: true},
	user_time: { type: Schema.Types.Date, default:new Date(+new Date() + 24*60*60*1000) },
	view: [{ type: Schema.Types.ObjectId, ref:"user" }],
	img: { type: Schema.Types.String, require: true },
	link: { type: Schema.Types.Array, require: true },
	country: { type: Schema.Types.String, require: true },
	city: { type: Schema.Types.String, require: true },
	district: { type: Schema.Types.String, require: true },
	language: { type: Schema.Types.String, require: true },
},
	{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
));

module.exports = route;	