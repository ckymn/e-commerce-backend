const { Product_Comment } = require("../model")
const { Product_Star } = require("../../star/model")
const Product = require("../../../store/products/model")
const User = require("../../auth/model")
const ApiError = require("../../../../errors/ApiError")
const BadWords = require("../../../admin/bad_words/model")
const Filter = require("bad-words")

const route = async( req,res,next) => {
    try {
        let { body ,kuserData , params} = req;
        
        // comment
        let filter = new Filter();
        let data = await BadWords.find({}).select("words -_id").lean();
        let words = data[0].words;
        await filter.addWords(...words);
        let _comment = filter.clean(body.comment).split("").filter(i => {
            if(i === "*")
                return true
            return false
        })
        if(_comment.length > 0)
            return next(new ApiError(" Your comment not available",400,null))

        // product comment
        let user = await User.findOne({ _id: kuserData.id }).lean();
        let _data = await new Product_Comment({
            ...body,
            product_id: params.id,
            author: kuserData.id,
            author_name: user.username
        }).save();
        if(!_data)
            return next(new ApiError( "Add Product Comment Data Error",400));
        // product update comments
        let p_data = await Product.findOneAndUpdate({ _id: params.id }, 
            {
                $push: {
                    "comments": _data._id
                }
            }, { new: true })
        if(!p_data)
            return next(new ApiError( "Update Product Comment Not Found!",404));
        // user update product_comment
        let u_data = await User.findOneAndUpdate({ _id: kuserData.id }, 
            {
                $push: {
                    "product_comment": _data._id
                }
            }, { new: true })
        if(!u_data)
            return next(new ApiError( "Update User Comment Field Not Found!",404));
        
        let pruduct_star = await Product_Star.create({
            rate: body.rate,
            author: kuserData.id,
            product_id: params.id,
            store_id: p_data.author,
        });
        if(!pruduct_star)
            return next(new ApiError( "Create Product Star Error",400));
            
        return res.status(200).send({ status: true, message: "User to Product Comment Success", data: _data })
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 500));
        }
        next(new ApiError(error?.message));
    }
}

module.exports = route