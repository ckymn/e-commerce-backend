const Data = require('../../../store/advertisement/model')
const Payment = require("../../../store/payment/model")
const { iyzipay , Iyzipay} = require("../../../../utils/iyzipay");
const ApiError = require('../../../../errors/ApiError');

const route = async (req, res) => {
  try { 
    let { files , body , params  } = req;
    let { is_approved  } = body;
    let buyer_ip = "192.168.1.37"
    console.log(body)
    await Data.findOne({ _id: params.id }).lean().exec(async(err,data) => {
      if(!data)
        return res.status(404).send({ status: false, message: "Not Found any Data"})
      if(data.is_approved === "wait"){
        if(is_approved === "no"){
          let _pay = await Payment.findOne({ads_id: data._id})
          if(!_pay)
            return next(new ApiError("Payment data not found",404));
          // ? IADE
          iyzipay.refund.create({
            ip: "192.168.1.37",
            price: _pay.price,
            paymentTransactionId: _pay.paymentTransactionId,
        }, async function (_, result) {
            if(result.status === "failure"){  
              return next(new ApiError(result.errorMessage,400));
            }else{
              let u_store_ads = await Data.findOneAndUpdate({ _id : params.id }, { $set: { is_approved: "no" }})
              if(!u_store_ads)
                return next(new ApiError("Update store advertisement status not found",404));
              return res.status(200).send({ status: true, message: "Magazanin Parasi Geri Odendi"});
            }
          });
        }
        if(is_approved === "yes"){
          let n_data = await Data.updateOne({ _id : params.id },
            { 
              $set: { 
                is_approved: "yes",
              }
            })
          if(!n_data) 
            return next(new ApiError("Admin update advertisement notification didn't match",409));
          return res.status(200).send({ status: true, message: "get single notification change success YES"})
        }
      }
      if(data.is_approved === "no"){
        if(is_approved === "wait"){
          let n_data = await Data.findOneAndUpdate({ _id: params.id },
            { $set: { is_approved: "wait" } },
            { new: true }
          );
          if(!n_data) 
            return next(new ApiError("Admin update advertisemnt didn't match",404));
          return res.status(200).send({ status: true, message: "get single notification change success WAIT"})
        }
        if(is_approved === "yes"){
          let u_data = await Data.updateOne({ _id: params.id },
            { $set: { is_approved: "yes" } }
          );
          if(u_data.matchedCount === 0) 
            return next(new ApiError("Admin update advertisement didn't match",409));
          return res.status(200).send({ status: true, message: "get single notification change success YES"})
        }
      }
      if(data.is_approved === "yes"){
        if(is_approved === "no"){
          let _pay = await Payment.findOne({ads_id: data._id})
          if(!_pay)
            return next(new ApiError("Payment data not found",404));
          // ? IADE
          iyzipay.refund.create({
            ip: "192.168.1.37",
            price: _pay.price,
            paymentTransactionId: _pay.paymentTransactionId,
        }, async function (_, result) {
            if(result.status === "failure"){  
              return next(new ApiError(result.errorMessage,400));
            }else{
              let u_store_ads = await Data.findOneAndUpdate({ _id : params.id }, { $set: { is_approved: "no" }})
              if(!u_store_ads)
                return next(new ApiError("Update store advertisement status not found",404));
              return res.status(200).send({ status: true, message: "Magazanin Parasi Geri Odendi"});
            }
          });
        }
        if(is_approved === "wait"){
          let n_data = await Data.findOneAndUpdate({ _id: params.id },
            { $set: { is_approved: "wait" } },
            { new: true }
          );
          if(!n_data) 
            return next(new ApiError("Admin update advertisement didn't match",409))
          return res.status(200).send({ status: true, message: "get single notification change success WAIT"})
        }
      }
    })
  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      next(new ApiError(error?.message, 422));
    }
    if (error.code === 27) {
      next(new ApiError("We Don't Have Any Data", 500, null));
    }
    next(new ApiError(error?.message, 500));
  }
  
};

module.exports = route;