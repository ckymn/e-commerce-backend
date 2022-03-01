const mongoose = require("mongoose")
let ObjectId = mongoose.Types.ObjectId;

var Sizes = new mongoose.Schema({
  size: { type: String, required: true },
  available: { type: Number, required: true, min: 0, max: 1000 },
  sku: {
    type: String, 
    required: true,
    validate: [/[a-zA-Z0-9]/, 'Product sku Should Only Have letters and numbers']
  },
  price: { type: Number, required: true , min: 0 },
  min_price: { type: Number, required: true , min: 0 , default:0}
})

var Images = new mongoose.Schema({
  kind: { 
    type: String, 
    required: false
  },
  url: { type: String, required: true }
})

var Variants = new mongoose.Schema({
  color: { type: String },
  images: [Images],
  sizes: [Sizes]
});

var Futures = new mongoose.Schema({
  key: { type: String },
  value: { type: String }
})

const products = new mongoose.Schema(
  {
    author: { type: ObjectId, ref: "stores" },

    title: { type: String, required: true },
    description: { type: String, required: true }, 
    brand: { type: String, required: true },
    style: { type: String, unique: true },
    categories: { type: String },
    variants: [ Variants ],
    futures: [ Futures ],

    is_approved: { type: String, default: "wait" },
    country: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    language: { type: String, enum:["da","nl","en","fi","fr","de","it","nb","pt","ro","ru","es","sv","tr"],require: true },
    location: {
      type: { type: String, default: "Point",},
      coordinates: { type: [Number], required: true },
    },
    comments: [{ type: ObjectId, ref: "product_comment" }],
    star: [{ type: ObjectId, ref: "product_star" }],
    favorite: [{ type: ObjectId, ref: "user" }],
    is_favorite: { type: Boolean, default: false}
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
products.index({ location: "2dsphere", title: "text" })
module.exports = mongoose.model("products", products);


