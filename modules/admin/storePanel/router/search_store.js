const ApiError = require("../../../../errors/ApiError");
const Data = require("../../../store/auth/model");

const route = async (req,res,next) => {
    try {
        let { global } = req.body;

        let data = await Data.aggregate([
          {
            $match: {
              $or: [
                // { $text: { $search: global } },
                { storename: { $regex: global, $options: "i" } },
              ],
            },
          },
          {
            $project: {
              _id: 1,
              storename: 1
            }
          }
        ]);
        if(data.length === 0)
            return next(new ApiError("Search store not found",404,data)) 
        return res.send({
          status: 200,
          message: "Search Store Data success return",
          data,
        });
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 204, []));
        }
        next(new ApiError(error?.message));
    }
};

module.exports = route;