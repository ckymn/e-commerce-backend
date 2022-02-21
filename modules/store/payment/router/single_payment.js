const { iyzipay , Iyzipay} = require("../../../../utils/iyzipay");
const route = async (req, res, next) => {
    try {
        let { userData, params } = req;
        await iyzipay.payment.retrieve({
            locale: Iyzipay.LOCALE.TR,
            conversationId: userData.id,
            paymentId: params.id,
        }, function (err, result) {
            if(err)
                return res.status(500).send({ status: false, message: `Iyzipay Error : ${err}`})
            if(result.status === "failure")
                return res.status(400).send({ status: false, message: result.errorMessage, code: result.errorCode})
            if(result.status === "success"){
                return res.status(200).send({ status: true, message: "Single Payment Success", data: result })
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