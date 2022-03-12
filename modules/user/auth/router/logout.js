require("dotenv").config();
const jwt = require("jsonwebtoken");
const Active = require("../../../admin/login/model")
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
  try {
    let { kuserData } = req;
    
    await jwt.sign({ id: kuserData.id }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "1ms",
    });
    // active remove
    let data = await Active.updateOne({ role: { $in: ["admin"] } },
      {
        $pull: {
          active: kuserData.id,
        },
      }
    );
    if(!data)
      return next(new ApiError("Not Found!",404))
    return res.send({ status: 200, message:"logout was successed"})
  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      next(new ApiError(error?.message, 422));
    }
    if (error.code === 27) {
      next(new ApiError("We Don't Have Any Data", 204, null));
    }
    next(new ApiError(error?.message))
}
};

module.exports = route;
