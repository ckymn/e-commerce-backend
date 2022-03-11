const {iyzipay, pay_form } = require("../../../../utils/iyzipay");
const { v4: uuidv4 } = require('uuid');

const Data = require("../model")
const Register = require("../../auth/model");
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res) => {
    try {
        let buyer_id = req.userData.id;
        let basket_id = uuidv4();
        let buyer_ip = "192.168.1.37"

        let {card_price,card_paid_price,card_installment,card_holder_name,card_number,
            card_expire_month,card_expire_year,card_cvc,card_register,buyerName,buyerSurname,
            buyerNumber,buyerEmail,tcNo,buyerAddress,buyerCity,buyerCountry,ship_name,
            ship_city,ship_country,ship_address,ship_b_name,ship_b_city,ship_b_country,ship_b_address,
            items,authCode,
        }= req.body;
        let request = await pay_form(basket_id,card_price,card_paid_price,card_installment,
            card_holder_name,card_number,card_expire_month,card_expire_year,card_cvc,
            card_register,buyer_id,buyerName,buyerSurname,buyerNumber,buyerEmail,tcNo,
            buyerAddress,buyer_ip,buyerCity,buyerCountry,ship_name,ship_city,
            ship_country,ship_address,ship_b_name,ship_b_city,ship_b_country,ship_b_address,items)
        
        // ODEME
        await iyzipay.payment.create(request, async function(err,result) {
            if(result.status === "failure")
                return next(new ApiError(result.errorMessage,400));     
            if(result.status === "success"){
                let time = items.time
                if(true){
                    let _data = await new Data({
                        author: buyer_id,
                        authCode: result.authCode,
                        basketId:basket_id,
                        paymentId: result.paymentId,
                        price: card_price,
                        paid_price: card_paid_price,
                        paymentTransactionId: result.itemTransactions[0].paymentTransactionId
                    })
                    if(!_data)
                        return next(new ApiError("Odeme Gerceklesti ama Veri Tabanina kaydedilmedi",400));
                    let _register = await Register.findOneAndUpdate({_id: buyer_id}, 
                        {
                            $set:{
                                "remain_date.time":time ,
                                "remain_date.updated_at": new Date()
                            }
                        },
                        { new: true })
                    if(!_register)
                        return next(new ApiError("Store date payment not found",404));
                    await _data.save();
                    return res.send({ status: 200, message: "Islem Devam ediyor", data: result})
                }
            }
            return res.status(500).send({ status: false, message:"Girdiginiz Kod Uyusmusyor .Tekrar deneyin"})
        })
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 500, null));
        }
        next(new ApiError(error?.message));
    }
}

module.exports = route