const Data = require('../../../store/advertisement/model')
const Payment = require("../../../store/payment/model")
const storage = require("../../../../uploads/storeAds")
const { iyzipay , Iyzipay} = require("../../../../utils/iyzipay")
const { networkInterfaces } = require("os")

const route = async (req, res) => {
  try { 
    let { file , body , params  } = req;
    let { is_approved ,link, banner_story_time } = body;
    let buyer_ip = networkInterfaces().en0[1].address

    await Data.findOne({ _id: params.id }).lean().exec(async(err,data) => {
      if(!data)
        return res.status(404).send({ status: false, message: "Not Found any Data"})
      if(data.is_approved === "wait"){
        if(is_approved === "no"){
          let _pay = await Payment.findOne({ $and: [{author: data.author}, {ads_id: data._id}] })
          iyzipay.refund.create({
            locale: Iyzipay.LOCALE.TR,
            conversationId: userData.id,
            paymentTransactionId: _pay.paymentTransactionId,
            price: _pay.price,//burasi paid_price ta olabilir dikkat
            currency: Iyzipay.CURRENCY.TRY,
            ip: buyer_ip
        }, function (err, result) {
            console.log(result);
        });
          let n_data = await Data.findOneAndUpdate({ _id : params.id }, { $set: { is_approved: "no" }}, { new: true })
          if(!n_data) 
            return res.status(400).send({ status: false, message: "get single notification don't cahange to NO"})
          return res.status(200).send({ status: true, message: "get single notification change success NO"})
        }
        if(is_approved === "yes"){
          const imageUrl = await storage.Upload(file, data.author, data._id);
          let n_data = await Data.findOneAndUpdate({ _id : params.id },
            { 
              $set: { 
                is_approved: "yes",
                img: imageUrl,
                link,
                banner_story_time
              }
            }, { new: true })
          if(!n_data) 
            return res.status(400).send({ status: false, message: "get single notification don't cahange to YES"})
          return res.status(200).send({ status: true, message: "get single notification change success YES"})
        }
      }
      if(data.is_approved === "no"){
        if(is_approved === "wait"){
          let n_data = await Data.findOneAndUpdate({ _id : params.id }, { $set: { is_approved: "wait" }}, { new: true })
          if(!n_data) 
            return res.status(400).send({ status: false, message: "get single notification don't cahange to WAIT"})
          return res.status(200).send({ status: true, message: "get single notification change success WAIT"})
        }
        if(is_approved === "yes"){
          const imageUrl = await storage.Upload(file, data.author, data._id);
          let str = await Promise.all(imageUrl).then(d => d );
          let n_data = await Data.findOneAndUpdate({ _id : params.id }, 
            { 
              $set: { 
                is_approved: "yes",
                img: str,
                link,
                banner_story_time
              }
            }, { new: true })
          if(!n_data) 
            return res.status(400).send({ status: false, message: "get single notification don't cahange to YES"})
          return res.status(200).send({ status: true, message: "get single notification change success YES"})
        }
      }
      if(data.is_approved === "yes"){
        if(is_approved === "no"){
          let _pay = await Payment.findOne({ $and: [{author: data.author}, {ads_id: data._id}] })
          iyzipay.refund.create({
            locale: Iyzipay.LOCALE.TR,
            conversationId: userData.id,
            paymentTransactionId: _pay.paymentTransactionId,
            //burasi paid_price ta olabilir dikkat
            price: _pay.price,
            currency: Iyzipay.CURRENCY.TRY,
            ip: buyer_ip
        }, function (err, result) {
            console.log(result);
        });
          let n_data = await Data.findOneAndUpdate({ _id : params.id }, { $set: { is_approved: "no" }}, { new: true })
          if(!n_data) 
            return res.status(400).send({ status: false, message: "get single notification don't cahange to NO"})
          return res.status(200).send({ status: true, message: "get single notification change success NO"})
        }
        if(is_approved === "wait"){
          let n_data = await Data.findOneAndUpdate({ _id : params.id }, { $set: { is_approved: "wait" }}, { new: true })
          if(!n_data) 
            return res.status(400).send({ status: false, message: "get single notification don't cahange to WAIT"})
          return res.status(200).send({ status: true, message: "get single notification change success WAIT"})
        }
      }
    })
  } catch (error) {
    if(error){
      if(error.name === "MongoError" && error.code === 11000)
          return res.status(500).send({ status: false, message: `Admin/Advertisement Notification, Mongo Already exists!  : ${error}` })
    }
    return res.status(500).send({ 
      status: false,
      message: `Single Post Advertisement Notificaton Error Cannot Upload Something Missing => ${error}`
    })
  }
  
};

module.exports = route;