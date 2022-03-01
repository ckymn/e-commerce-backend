const Data = require("../model")
const { iyzipay , Iyzipay} = require("../../../../utils/iyzipay");
const route = async (req, res, next) => {
    try {
        let { userData, params } = req;
        let buyer_ip = "192.168.1.37"
        let _data = await Data.findOne({ $and:[{_id: params.id},{author: userData.id}]}).lean();
        await iyzipay.payment.retrieve({
            ip:"192.168.1.37",
            paymentId: _data.paymentId,
        }, function (err, result) {
            if(result.status === "failure")
                return res.status(402).send({ status: false, message: result.errorMessage, code: result.errorCode})
            if(result.status === "success"){
                return res.status(200).send({ status: true, message: "Single Payment Success", data: { result, _data } })
            }
        })
    } catch (error) {
        console.log(error)
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `Single Payment Error ,Something Missing => ${error}`})
    }
}

module.exports = route