const mongoose = require("mongoose")
let ObjectId = mongoose.Types.ObjectId;
const { v4: uuidv4 } = require('uuid');

const products = new mongoose.Schema({
    author: { type: ObjectId, ref: "stores"},
    sector_name: { type: String, require: false },
    category_one: { type: String, require: false },
    category_two: { type: String, require: false },
    category_three: { type: String, require: false },
    category_four: { type: String, require: false },
    category_five: { type: String, require: false },
    images: { type: Array, require: true },
    color: { type: Array, require: true },
    product_code: { type: Number , default: () =>{ uuidv4() } },
    product_name: { type: String, require: true , unique: true },
    price: { type: Number , require: true },
    min_price: { type: Number, require: true },
    gender: { type: String, require: true },
    material: { type: String, require: true },
    product_length: { type: String, require: true },
    product_arm_leg_length: { type: Number, require: true },
    product_body_size: { type: String, require: true },
    description: { type: String, require: true },
    is_approved: { type: String, default: "wait" },
    country: { type: String, required: true },
    city: { type: String , required: true },
    district: { type: String , required: true },
    language: { type: String, required: true },
    location: {
		type: {
			type: {
				type: String,
				enum: ['Point'],
			},
		  	coordinates: {
				type: [ Number ],
		 	},
		},
	},
    comments: [{ type: ObjectId , ref: "product_comment"}],
    star: [{ type: ObjectId, ref: "product_star"}]
},
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
)
products.index({ location: "2dsphere"})
module.exports = mongoose.model("products", products);

