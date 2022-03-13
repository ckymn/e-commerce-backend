const Product = require("../../products/model");
  
  const route = async (req, res,next) => {
    try {
      let { global } = req.body;
  
      let data = await Product.aggregate([
        {
          $match: {
            $or: [
              { title: { $regex: global, $options: "i" } },
              { "variants.sizes.sku": { $regex: global, $options: "i" } },
            ],
          },
        },
        //{ $project: { sector_name: 1, category_one: 1 , parent_id: 1, child_id: 1} },
      ]);
      
      return res.send({
        status: 200,
        message: "Search Categories success",
        data
      });
    } catch (error) {
        console.log(error)
      if (error.name === "MongoError" && error.code === 11000) {
        next(new ApiError(error?.message, 422));
      }
      if (error.code === 27) {
        next(new ApiError("We Don't Have Any Data", 204, null));
      }
      next(new ApiError(error?.message));
    }
  };
  
  module.exports = route;
  