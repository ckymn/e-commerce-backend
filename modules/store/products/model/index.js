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
  currency: { type: String, required: false , enum:["₺","$"]},
  price: { type: Number, required: true , min: 0 },
  min_price: { type: Number, required: true , min: 0 , default:0}
})

var Images = new mongoose.Schema({
  _id: { type: String, required: true},
  kind: { 
    type: String, 
    required: false
  },
  url: { type: String, required: true }
});

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
    style: { type: String },
    phone: { type: String, required: true },
    categories: {
      sector: { type: ObjectId, ref:"sector"},
      category_one: { type: ObjectId, ref:"category_one"},
      category_two: { type: ObjectId, ref:"category_two"},
      category_three: { type: ObjectId, ref:"category_three"},
      category_four: { type: ObjectId, ref:"category_four"},
      category_five: { type: ObjectId, ref:"category_five"},
    },
    variants: [ Variants ],
    futures: [ Futures ],
    is_approved: { type: String, default: "wait" },
    country: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    language: { type: String, enum:["da","nl","en","fi","fr","de","it","nb","pt","ro","ru","es","sv","tr"],require: true },
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
    favorite: [{ type: ObjectId, ref: "users" }],
    is_favorite: { type: Boolean, default: false},
    store_open_hour: { type: Number },
    store_close_hour: { type: Number },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
products.index({ location: "2dsphere", title: "text" })
module.exports = mongoose.model("products", products);


