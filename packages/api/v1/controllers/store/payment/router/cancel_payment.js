const { iyzipay , Iyzipay} = require("../../../../utils/iyzipay");
const Data = require("../model");
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
  try {
    let { userData, params } = req;
    let buyer_ip = "192.168.1.37";
    let _data = await Data.findOne({
      $and: [{ _id: params.id }, { author: userData.id }],
    }).lean();
    if(!_data)  
      return next(new ApiError("Payment Data not found",404,[]));

    await iyzipay.cancel.create({
      ip: "192.168.1.37",
      paymentId: _data.paymentId,
    }, async function (err, result) {
      if(result.status === "failure")
        return next(new ApiError(result.errorMessage,400,[]));
      if(result.status === "success"){
        let d_payment = await Data.deleteOne({ $and: [{_id: params.id },{ author: userData.id }] });
        if(d_payment.deletedCount === 0)    
          return next(new ApiError("Payment delete data didn't work",400,[]));
        return res.send({ status: 200, message: "Cancel Payment Success", data: result });
      }
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