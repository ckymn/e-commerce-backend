const mongoose = require("mongoose")
let ObjectId = mongoose.Types.ObjectId;
const { v4: uuidv4 } = require('uuid');

const products = new mongoose.Schema(
  {
    author: { type: ObjectId, ref: "stores" },
    sector_name: { type: String, require: false },
    category_one: { type: String, require: false },
    category_two: { type: String, require: false },
    category_three: { type: String, require: false },
    category_four: { type: String, require: false },
    category_five: { type: String, require: false },

    product_name: { type: String, require: true, unique: true },
    product_code: { type: ObjectId, default: ObjectId },
    product_brand: { type: String, required: false },
    description: { type: String, required: false },
    color: [
      {
        name: { type: String },
        img: {type: Array },
        barkod: {type: String},
        price: {type: Number},
        stock: {type: Number},
      },
    ],
    age_group: { type: String, enum: ["Bebek", "Çocuk", "Genç", "Yetişkin"] },
    gender: { type: String, enum: ["Erkek", "Kadin/Kiz", "Unisex"] },
    length: { type: String, enum: ["Kisa", "Orta", "Uzun", "Battal Boy"] },
    arm_type: { type: String, required: false },
    material: { type: String, required: false },
    number_of_pieces: { type: String, required: false },
    collar_type: { type: String, required: false },
    model: { type: String, required: false },
    pattern: { type: String, required: false },
    collar_type: { type: String, required: false },
    package_included: { type: String, required: false },
    pocket: { type: String, required: false },
    touch_type: { type: String, required: false },
    extra_feature: { type: String, required: false },
    thickness: { type: String, required: false },
    mold: { type: String, required: false },
    arm_length: { type: String, required: false },
    usage_area: { type: String, required: false },
    fabric_type: { type: String, required: false },
    style: { type: String, required: false },
    body_size: { type: String, required: false },
    product_type: { type: String, required: false },
    fabric_thecnology: { type: String, required: false },
    sustainably: { type: String, required: false },
    yarn_properties: { type: String, required: false },
    product_detail: { type: String, required: false },
    thecnic: { type: String, required: false },
    down_team: { type: String, required: false },
    colection: { type: String, required: false },
    return_school: { type: String, required: false },
    persona: { type: String, required: false },
    siluet: { type: String, required: false },
    okazyon: { type: String, required: false },
    printing_technique: { type: String, required: false },
    sustainably_detail: { type: String, required: false },
    cord_status: { type: String, required: false },
    leather_quality: { type: String, required: false },

    is_approved: { type: String, default: "wait" },
    country: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    language: { type: String, required: true },
    location: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number],
      },
    },
    comments: [{ type: ObjectId, ref: "product_comment" }],
    star: [{ type: ObjectId, ref: "product_star" }],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
products.index({ location: "2dsphere"})
module.exports = mongoose.model("products", products);

