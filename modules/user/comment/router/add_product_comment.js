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
        let comment_word = await BadWords.find({}).select("words -_id").lean();
        if(comment_word.length === 0)
            return next(new ApiError("Not found any words",200,comment_word))
        let words = comment_word[0].words;
        await filter.addWords(...words);
        let _comment = filter.clean(body.comment).split("").filter(i => {
            if(i === "*")
                return true
            return false
        })
        if(_comment.length > 0)
            return next(new ApiError(" Your comment not available",400,null))

        // product comment create
        let user = await User.findOne({ _id: kuserData.id }).lean();
        let data = await Product_Comment.create({
            ...body,
            product_id: params.id,
            author: kuserData.id,
            author_name: user.username
        })
        // product comments update
        let p_data = await Product.findOneAndUpdate(
          { _id: params.id },
          {
            $push: {
              comments: data._id,
            },
          },
          { new: true }
        );
        // user update product_comment
        let u_data = await User.findOneAndUpdate(
          { _id: kuserData.id },
          {
            $push: {
              product_comment: data._id,
            },
          },
          { new: true }
        );
        // product star
        await Product_Star.create({
            rate: body.rate,
            author: kuserData.id,
            product_id: params.id,
            store_id: p_data.author,
        });
        return res.status(200).send({ message: "User to Product Comment Success", data })
    } catch (error) {
        console.log(error)
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 204,null));
        }
        next(new ApiError(error?.message));
    }
}

module.exports = route