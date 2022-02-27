const mongoose = require("mongoose")
let ObjectId = mongoose.Types.ObjectId;
const { v4: uuidv4 } = require('uuid');

const products = new mongoose.Schema(
  {
    author: { type: ObjectId, ref: "stores" },
    sector_name: { type: String, require: true },
    category_one: { type: String, require: true },
    category_two: { type: String, require: false , default:""},
    category_three: { type: String, require: false , default:""},
    category_four: { type: String, require: false , default:""},
    category_five: { type: String, require: false , default:""},

    product_name: { type: String, required: true, unique: true },
    product_code: { type: ObjectId, default: ObjectId },
    product_brand: { type: String, required: false , default:""},
    description: { type: String, required: true  },
    color: [
      {
        name: { type: String , required: false },
        img: {type: Array , required: false },
        barkod: {type: String, required: false },
        price: {type: Number, required: false },
        min_price: { type: Number, required: false ,default: 0},
        stock: {type: Number, required: false },
      },
    ],
    age_group: { type: String, enum: ["Bebek", "Çocuk", "Genç", "Yetişkin"] , default:"Bebek"},
    gender: { type: String, enum: ["Erkek", "Kadin/Kiz", "Unisex"] , default:"Erkek"},
    length: { type: String, enum: ["Kisa", "Orta", "Uzun", "Battal Boy"] , default:"Kisa"},
    arm_type: { type: String, required: false, default:"" },
    material: { type: String, required: false , default:""},
    number_of_pieces: { type: String, required: false , default:""},
    collar_type: { type: String, required: false , default:""},
    model: { type: String, required: false , default:""},
    pattern: { type: String, required: false , default:""},
    collar_type: { type: String, required: false , default:""},
    package_included: { type: String, required: false , default:""},
    pocket: { type: String, required: false , default:""},
    touch_type: { type: String, required: false , default:""},
    extra_feature: { type: String, required: false , default:""},
    thickness: { type: String, required: false , default:""},
    mold: { type: String, required: false , default:""},
    arm_length: { type: String, required: false , default:""},
    usage_area: { type: String, required: false , default:""},
    fabric_type: { type: String, required: false , default:""},
    style: { type: String, required: false , default:""},
    body_size: { type: String, required: false , default:""},
    product_type: { type: String, required: false , default:""},
    fabric_thecnology: { type: String, required: false , default:""},
    sustainably: { type: String, required: false , default:""},
    yarn_properties: { type: String, required: false , default:""},
    product_detail: { type: String, required: false , default:""},
    thecnic: { type: String, required: false , default:""},
    down_team: { type: String, required: false, default:"" },
    colection: { type: String, required: false , default:""},
    return_school: { type: String, required: false , default:""},
    persona: { type: String, required: false , default:""},
    siluet: { type: String, required: false , default:""},
    okazyon: { type: String, required: false , default:""},
    printing_technique: { type: String, required: false , default:""},
    sustainably_detail: { type: String, required: false , default:""},
    cord_status: { type: String, required: false , default:""},
    leather_quality: { type: String, required: false , default:""},

    is_approved: { type: String, default: "wait" },
    country: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    language: { type: String, required: true },
    location: {
      type: { type: String, default: "Point",},
      coordinates: { type: [Number], required: true },
    },
    comments: [{ type: ObjectId, ref: "product_comment" }],
    star: [{ type: ObjectId, ref: "product_star" }],
    favorite: [{ type: ObjectId, ref: "user" }]
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
products.index({ location: "2dsphere", product_name: "text" })
module.exports = mongoose.model("products", products);

