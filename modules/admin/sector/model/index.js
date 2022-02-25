const { Schema , Mongoose, model } = require("mongoose")

const sector = new Schema({
    sector_name : { type: Schema.Types.String, require: true },
    category_one : { type: Schema.Types.Array },
},
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)
sector.index({ sector_name: "text", category_one: "text" })
const Sector = new model("sector", sector);

const category_one = new Schema({
    category_one : { type: Schema.Types.String, require: true },
    category_two : { type: Schema.Types.Array },
    parent_id: { type: Schema.Types.ObjectId, ref: "sector"}
},
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)
category_one.index({ category_one: "text", category_two: "text" })
const Category_One = new model("category_one", category_one)

const category_two = new Schema({
    category_two : { type: Schema.Types.String, require: true },
    category_three : { type: Schema.Types.Array },
    parent_id: { type: Schema.Types.ObjectId, ref: "sector"}
},
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)
category_two.index({ category_two: "text", category_three: "text" })
const Category_Two = new model("category_two", category_two)

const category_three = new Schema({
    category_three : { type: Schema.Types.String,require: true },
    category_four : { type: Schema.Types.Array },
    parent_id: { type: Schema.Types.ObjectId, ref: "sector"}
},
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)
category_three.index({ category_three: "text", category_four: "text" })
const Category_Three = new model("category_three",category_three)

const category_four = new Schema({
    category_four : { type: Schema.Types.String,require: true },
    category_five : { type: Schema.Types.Array },
    parent_id: { type: Schema.Types.ObjectId, ref: "sector"}
},
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)
category_four.index({ category_four: "text", category_five: "text" })
const Category_Four = new model("category_four", category_four)

const category_five = new Schema({
    category_five : { type: Schema.Types.String,require: true },
    parent_id: { type: Schema.Types.ObjectId, ref: "sector"}
},
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)
category_five.index({ category_five: "text"})
const Category_Five = new model("category_five",category_five);

module.exports =  { Sector , Category_One, Category_Two, Category_Three, Category_Four, Category_Five } ;