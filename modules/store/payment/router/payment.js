const {iyzipay, pay_form } = require("../../../../utils/iyzipay");
const { networkInterfaces } = require("os")
const { v4: uuidv4 } = require('uuid');

const Data = require("../model")
const Register = require("../../auth/model")

const route = async (req, res) => {
    try {
        let buyer_id = req.userData.id;
        let basket_id = uuidv4();
        let buyer_ip = networkInterfaces().en0[1].address

        let {card_price,card_paid_price,card_installment,card_holder_name,card_number,
            card_expire_month,card_expire_year,card_cvc,card_register,buyerName,buyerSurname,
            buyerNumber,buyerEmail,tcNo,buyerAddress,buyerCity,buyerCountry,zipCode,ship_name,
            ship_city,ship_country,ship_address,ship_b_name,ship_b_city,ship_b_country,ship_b_address,
            items,authCode,product_name
        }= req.body;
        let request = await pay_form(basket_id,card_price,card_paid_price,card_installment,
            card_holder_name,card_number,card_expire_month,card_expire_year,card_cvc,
            card_register,buyer_id,buyerName,buyerSurname,buyerNumber,buyerEmail,tcNo,
            buyerAddress,buyer_ip,buyerCity,buyerCountry,zipCode,ship_name,ship_city,
            ship_country,ship_address,ship_b_name,ship_b_city,ship_b_country,ship_b_address,items)
        
        await iyzipay.payment.create(request, async function(err,result) {
            if(err)
                return res.status(500).send({ status: false, message: `Error ${err}`})
            if(result.status === "failure")
                return res.status(400).send({ status: false, message: result.errorMessage, code: result.errorCode})
            if(result.status === "success"){
                let p_id = result.paymentId
                let time = items.time
                // burasina dogrulama kodu gelecek !!
                if(true){
                    let _data = await new Data({
                        author: buyer_id,
                        product_name,
                        card_paid_price,
                        time,
                        basketId:basket_id,
                        paymentId: p_id,

                        buyerName,
                        buyerSurname,
                        buyerNumber,
                        buyerEmail,
                        buyerAddress,
                        buyerCity,
                        buyerCountry,
                        ship_name,
                        ship_city,
                        ship_country,
                        ship_address,
                        ship_b_name,
                        ship_b_city,
                        ship_b_country,
                        ship_b_address,
                        items
                    })
                    if(!_data)
                        return res.status(400).send({ status: false, message: "Odeme Gerceklesti ama Veri Tabanina kaydedilmedi"})
                    let _register = await Register.findOneAndUpdate({_id: buyer_id}, {$set:{ remain_date:time }}, { new: true })
                    if(!_register)
                        return res.status(400).send({ status: false, message: "Odeme Gerceklesti ama Kullanici Hesap suresi guncellenmedi"}) 
                    await _data.save();
                    return res.status(200).send({ status: true, message: "Islem Devam ediyor", data: result})
                }
            }
            return res.status(500).send({ status: false, message:"Girdiginiz Kod Uyusmusyor .Tekrar deneyin"})
        })
    } catch (error) {
        if (error) {
            if (error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `Store Payment Error Cannot Upload Something Missing => ${error}` })
    }
}

module.exports = route