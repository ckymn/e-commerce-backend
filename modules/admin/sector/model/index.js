const { Schema , Mongoose, model } = require("mongoose")

const Sector = new model("sector", new Schema({
    sector_name : { type: Schema.Types.String, index: true ,require: true },
    category_one : { type: Schema.Types.Array , index: true },
},
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
))

const Category_One = new model("category_one", new Schema({
    category_one : { type: Schema.Types.String, index: true ,require: true },
    category_two : { type: Schema.Types.Array ,index: true },
    parent_id: { type: Schema.Types.ObjectId, ref: "sector"}
},
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
))

const Category_Two = new model("category_two", new Schema({
    category_two : { type: Schema.Types.String, index: true ,require: true },
    category_three : { type: Schema.Types.Array ,index: true },
    parent_id: { type: Schema.Types.ObjectId, ref: "sector"}
},
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
))

const Category_Three = new model("category_three", new Schema({
    category_three : { type: Schema.Types.String, index: true ,require: true },
    category_four : { type: Schema.Types.Array ,index: true },
    parent_id: { type: Schema.Types.ObjectId, ref: "sector"}
},
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
))

const Category_Four = new model("category_four", new Schema({
    category_four : { type: Schema.Types.String, index: true ,require: true },
    category_five : { type: Schema.Types.Array ,index: true },
    parent_id: { type: Schema.Types.ObjectId, ref: "sector"}
},
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
))

const Category_Five = new model("category_five", new Schema({
    category_five : { type: Schema.Types.String, index: true ,require: true },
    parent_id: { type: Schema.Types.ObjectId, ref: "sector"}
},
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
))

module.exports =  { Sector , Category_One, Category_Two, Category_Three, Category_Four, Category_Five } ;