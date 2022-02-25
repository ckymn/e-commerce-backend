
const Data = require("../model")
const Payment = require("../../payment/model")
const {iyzipay, pay_form_ads} = require("../../../../utils/iyzipay")
const { networkInterfaces } = require("os")
const { v4: uuidv4 } = require('uuid');

const route = async (req, res, next) => {
    try {
        let { body , userData } = req;
        let buyer_id = userData.id;
        let basket_id = uuidv4();
        let buyer_ip = networkInterfaces().en0[1].address;
        let {card_price,card_paid_price,card_installment,card_holder_name,card_number,
            card_expire_month,card_expire_year,card_cvc,card_register,buyerName,buyerSurname,
            buyerNumber,buyerEmail,tcNo,buyerAddress,buyerCity,buyerCountry,ship_b_name,ship_b_city,
            ship_b_country,ship_b_address,items,ads_which,ads_price,ads_date,ads_description,
            link,banner_story_time,country,city,district,language}= body;
        let request = await pay_form_ads(basket_id,card_price,card_paid_price,card_installment,
            card_holder_name,card_number,card_expire_month,card_expire_year,card_cvc,
            card_register,buyer_id,buyerName,buyerSurname,buyerNumber,buyerEmail,tcNo,
            ship_b_name,ship_b_city,ship_b_country,ship_b_address,
            buyerAddress,buyer_ip,buyerCity,buyerCountry,items)

        if(banner_story_time === "1d"){
            await iyzipay.payment.create(request,async function(err,result) {
                if(err)
                    return res.status(500).send({ status: false, message: `Iyzipay Error : ${err}`})
                if(result.status === "failure")
                    return res.status(result.errorCode).send({ status: false, message: result.errorMessage })
                if(result.status === "success"){
                    if(true){
                        let _data = await Data.create({
                            author: userData.id,
                            authCode: result.authCode,
                            ads_which,
                            ads_price,
                            ads_date,
                            ads_description,
                            link,
                            country,
                            city,
                            district,
                            language,
                            banner_story_time: new Date(+new Date()+24*60*60*1000)
                        });
                        if(!_data)
                            return res.status(404).send({ status: false, message: "Save Advertisement error"})
                        await Payment.create({
                            author: buyer_id,
                            basketId:basket_id,
                            paymentId: result.paymentId,
                            price: card_price,
                            paid_price: card_paid_price,
                            ads_id: _data._id,
                            paymentTransactionId: result.paymentTransactionId
                        })
                        return res.status(200).send({ status: true, message: "Add Advertisement data save success", data: result})
                    }
                }
            })
        }
        if(banner_story_time === "5d"){
            await iyzipay.payment.create(request,async function(err,result) {
                if(err)
                    return res.status(500).send({ status: false, message: `Iyzipay Error : ${err}`})
                if(result.status === "failure")
                    return res.status(result.errorCode).send({ status: false, message: result.errorMessage })
                if(result.status === "success"){
                    if(true){
                        let _data = await Data.create({
                            author: userData.id,
                            authCode: result.authCode,
                            ads_which,
                            ads_price,
                            ads_date,
                            ads_description,
                            link,
                            country,
                            city,
                            district,
                            language,
                            banner_story_time: new Date(+new Date()+5*24*60*60*1000)
                        });
                        if(!_data)
                            return res.status(404).send({ status: false, message: "Save Advertisement error"})
                        await Payment.create({
                            author: buyer_id,
                            basketId:basket_id,
                            paymentId: result.paymentId,
                            price: card_price,
                            paid_price: card_paid_price,
                            ads_id: _data._id,
                            paymentTransactionId: result.paymentTransactionId
                        })
                        return res.status(200).send({ status: true, message: "Add Advertisement data save success", data: result})
                    }
                }
            })
        }
        if(banner_story_time === "1w"){
            await iyzipay.payment.create(request,async function(err,result) {
                if(err)
                    return res.status(500).send({ status: false, message: `Iyzipay Error : ${err}`})
                if(result.status === "failure")
                    return res.status(result.errorCode).send({ status: false, message: result.errorMessage })
                if(result.status === "success"){
                    if(true){
                        let _data = await Data.create({
                            author: userData.id,
                            authCode: result.authCode,
                            ads_which,
                            ads_price,
                            ads_date,
                            ads_description,
                            link,
                            country,
                            city,
                            district,
                            language,
                            banner_story_time: new Date(+new Date()+7*24*60*60*1000)
                        });
                        if(!_data)
                            return res.status(404).send({ status: false, message: "Save Advertisement error"})
                        await Payment.create({
                            author: buyer_id,
                            basketId:basket_id,
                            paymentId: result.paymentId,
                            price: card_price,
                            paid_price: card_paid_price,
                            ads_id: _data._id,
                            paymentTransactionId: result.paymentTransactionId
                        })
                        return res.status(200).send({ status: true, message: "Add Advertisement data save success", data: result})
                    }
                }
            })
        }
        if(banner_story_time === "2w"){
            await iyzipay.payment.create(request,async function(err,result) {
                if(err)
                    return res.status(500).send({ status: false, message: `Iyzipay Error : ${err}`})
                if(result.status === "failure")
                    return res.status(result.errorCode).send({ status: false, message: result.errorMessage })
                if(result.status === "success"){
                    // burasi dogrulama kodu gelecek !
                    if(true){
                        let _data = await Data.create({
                            author: userData.id,
                            authCode: result.authCode,
                            ads_which,
                            ads_price,
                            ads_date,
                            ads_description,
                            link,
                            country,
                            city,
                            district,
                            language,
                            banner_story_time: new Date(+new Date()+2*7*24*60*60*1000)
                        });
                        if(!_data)
                            return res.status(404).send({ status: false, message: "Save Advertisement error"})
                        await Payment.create({
                            author: buyer_id,
                            basketId:basket_id,
                            paymentId: result.paymentId,
                            price: card_price,
                            paid_price: card_paid_price,
                            ads_id: _data._id,
                            paymentTransactionId: result.paymentTransactionId
                        })  
                        return res.status(200).send({ status: true, message: "Add Advertisement data save success", data: result})
                    }
                }
            })
        }
        if(banner_story_time === "1m"){
            await iyzipay.payment.create(request,async function(err,result) {
                if(err)
                    return res.status(500).send({ status: false, message: `Iyzipay Error : ${err}`})
                if(result.status === "failure")
                    return res.status(400).send({ status: false, message: result.errorMessage, code: result.errorCode })
                if(result.status === "success"){
                    if(true){
                        let _data = await Data.create({
                            author: userData.id,
                            authCode: result.authCode,
                            ads_which,
                            ads_price,
                            ads_date,
                            ads_description,
                            link,
                            country,
                            city,
                            district,
                            language,
                            banner_story_time: new Date(+new Date()+4*7*24*60*60*1000)
                        });
                        if(!_data)
                            return res.status(404).send({ status: false, message: "Save Advertisement error"})
                        await Payment.create({
                            author: buyer_id,
                            basketId:basket_id,
                            paymentId: result.paymentId,
                            price: card_price,
                            paid_price: card_paid_price,
                            ads_id: _data._id,
                            paymentTransactionId: result.paymentTransactionId
                        })
                        return res.status(200).send({ status: true, message: "Add Advertisement data save success", data: result })
                    }
                }
            })
        }
    } catch (error) {
        console.log(error)
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `Add Advertisement Error Cannot Upload Something Missing => ${error}`})
    }
}

module.exports = route