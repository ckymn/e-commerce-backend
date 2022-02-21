const Data = require("../model")
const { iyzipay , Iyzipay} = require("../../../../utils/iyzipay")
const { networkInterfaces } = require("os")

// enviremont tan al
const route = async (req,res,next) => { 
    try {
        let { userData, params } = req;
        let _data = await Data.findOne({ $and: [ { author: userData.id }, { _id: params.id } ] }).lean();
        if(!_data)
            return res.status(404).send({ status: false, message: "You don't have any Order"})
        await iyzipay.cancel.create({
            locale: Iyzipay.LOCALE.TR,
            conversationId: userData.id,
            paymentId: _data.paymentId,
            ip: networkInterfaces().en0[1].address
        },async function(err,result) {
            if(err)
                return res.status(500).send({ status: false, message: `Error ${err}`})
            if(result.status == "failure")
                return res.status(400).send({ status: false, message: result.errorMessage, code: result.errorCode})
            if(result.status == "success"){
                let d_update  = await Data.findOneAndUpdate({ $and: [ { author: userData.id }, { _id: params.id } ]}, {$set:{ status: "cancel"}},{new:true})
                if(!d_update)
                    return res.status(400).send({ status: false, message: "Odeme Iptal Edildi ama Siparis Durumu Degismedi"})
                return res.status(200).send({ status: true, message: "The Payment was canceled and Order status was changed", data:d_update })
            }
        })        
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `Store Orders Error Something Missing => ${error}`})
    }
};

module.exports = route;