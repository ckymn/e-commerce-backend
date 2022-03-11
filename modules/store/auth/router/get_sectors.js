const { Sector } = require("../../../admin/sector/model");

const route = async (req,res) => {
    try {
        let data = await Sector.find({}).lean().exec(); 
        
        return res.send({ status: 200, message: " Sector data success", data });
        
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        next(new ApiError(error?.message, 422));
      }
      if (error.code === 27) {
        next(new ApiError("We Don't Have Any Data", 204, null));
      }
      next(new ApiError(error?.message));
    }
}

module.exports = route;