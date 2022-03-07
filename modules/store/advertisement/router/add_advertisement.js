const Store = require("../../auth/model")
const Data = require("../model")
const Payment = require("../../payment/model")
const {iyzipay, pay_form_ads} = require("../../../../utils/iyzipay")
const { v4: uuidv4 } = require('uuid');
const storage = require("../../../../uploads/storeAds")
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
    try {
        let { body , userData ,files} = req;
        let buyer_id = userData.id;
        let basket_id = uuidv4();
        let buyer_ip = "192.168.1.37"

        let store = await Store.findOne({ _id: userData.id });
        if(!store)
            return next(new ApiError("Store Not Found",404))
        
        let {card_price,card_paid_price,card_installment,card_holder_name,card_number,
            card_expire_month,card_expire_year,card_cvc,card_register,buyerName,buyerSurname,
            buyerNumber,buyerEmail,tcNo,buyerAddress,buyerCity,buyerCountry,ship_b_name,ship_b_city,
            ship_b_country,ship_b_address,items,ads_time}= body;
        let request = await pay_form_ads(basket_id,card_price,card_paid_price,card_installment,
            card_holder_name,card_number,card_expire_month,card_expire_year,card_cvc,
            card_register,buyer_id,buyerName,buyerSurname,buyerNumber,buyerEmail,tcNo,
            ship_b_name,ship_b_city,ship_b_country,ship_b_address,
            buyerAddress,buyer_ip,buyerCity,buyerCountry,items)
        
        if(ads_time === "1d"){
            // !BURDA IP ADRESINI KONTROL ETMELISIN
            await iyzipay.payment.create(request,async function(_,result) {
                if(result.status === "failure")
                    return next(new ApiError(result.errorMessage,400))
                if(result.status === "success"){
                    if(true){
                        let _data = await new Data({
                            ...body,
                            author: userData.id,
                            authCode: result.authCode,
                            banner_story_time: new Date(+new Date()+24*60*60*1000),
                            location: {
                                coordinates: [ parseFloat(store.location.coordinates[0]),parseFloat(store.location.coordinates[1]) ]
                            }
                        });
                        if(!_data)
                            return next(new ApiError("Create store advertisement",400))
                        const imagesUrl = await storage.Upload(files,_data._id);
                        let str = await Promise.all(imagesUrl).then(d => d );
                        await _data.set({
                            img: str.map(i =>i)
                        });
                        await _data.save();
                        let p_ads = await Payment.create({
                            author: buyer_id,
                            basketId:basket_id,
                            paymentId: result.paymentId,
                            price: card_price,
                            paid_price: card_paid_price,
                            ads_id: _data._id,
                            paymentTransactionId: result.itemTransactions[0].paymentTransactionId
                        })
                        if(!p_ads)
                            return next(new ApiError("Create store payment",400))
                        return res.status(200).send({ status: true, message: "Add Advertisement data save success", data: result})
                    }
                }
            })
        }
        if(ads_time === "5d"){
            await iyzipay.payment.create(request,async function(err,result) {
                if(result.status === "failure")
                    return next(new ApiError(result.errorMessage,400))
                if(result.status === "success"){
                    if(true){
                        let _data = await Data.create({
                            ...body,
                            author: userData.id,
                            authCode: result.authCode,
                            banner_story_time: new Date(+new Date()+5*24*60*60*1000),
                            location: {
                                coordinates: [ parseFloat(store.location.coordinates[0]),parseFloat(store.location.coordinates[1]) ]
                            }
                        });
                        if(!_data)
                            return next(new ApiError("Create store advertisement",400))
                        const imagesUrl = await storage.Upload(files,_data._id);
                        let str = await Promise.all(imagesUrl).then(d => d );
                        await Data.updateOne({ _id: _data._id},{ $push: { img: str }})
                        let p_ads = await Payment.create({
                            author: buyer_id,
                            basketId:basket_id,
                            paymentId: result.paymentId,
                            price: card_price,
                            paid_price: card_paid_price,
                            ads_id: _data._id,
                            paymentTransactionId: result.itemTransactions[0].paymentTransactionId
                        })
                        if(!p_ads)
                            return next(new ApiError("Create store payment",400))
                        return res.status(200).send({ status: true, message: "Add Advertisement data save success", data: result})
                    }
                }
            })
        }
        if(ads_time === "1w"){
            await iyzipay.payment.create(request,async function(err,result) {
                if(result.status === "failure")
                    return next(new ApiError(result.errorMessage,400))
                if(result.status === "success"){
                    if(true){
                        let _data = await Data.create({
                            ...body,
                            author: userData.id,
                            authCode: result.authCode,
                            banner_story_time: new Date(+new Date()+7*24*60*60*1000),
                            location: {
                                coordinates: [ parseFloat(store.location.coordinates[0]),parseFloat(store.location.coordinates[1]) ]
                            }
                        });
                        if(!_data)
                            return next(new ApiError("Create store advertisement",400))
                        const imagesUrl = await storage.Upload(files,_data._id);
                        let str = await Promise.all(imagesUrl).then(d => d );
                        await Data.updateOne({ _id: _data._id},{ $push: { img: str }})
                        let p_ads = await Payment.create({
                            author: buyer_id,
                            basketId:basket_id,
                            paymentId: result.paymentId,
                            price: card_price,
                            paid_price: card_paid_price,
                            ads_id: _data._id,
                            paymentTransactionId: result.itemTransactions[0].paymentTransactionId
                        })
                        if(!p_ads)
                            return next(new ApiError("Create store payment",400))
                        return res.status(200).send({ status: true, message: "Add Advertisement data save success", data: result})
                    }
                }
            })
        }
        if(ads_time === "2w"){
            await iyzipay.payment.create(request,async function(err,result) {
                if(result.status === "failure")
                    return next(new ApiError(result.errorMessage,400))
                if(result.status === "success"){
                    // burasi dogrulama kodu gelecek !
                    if(true){
                        let _data = await Data.create({
                            ...body,
                            author: userData.id,
                            authCode: result.authCode,
                            banner_story_time: new Date(+new Date()+2*7*24*60*60*1000),
                            location: {
                                coordinates: [ parseFloat(store.location.coordinates[0]),parseFloat(store.location.coordinates[1]) ]
                            }
                        });
                        if(!_data)
                            return next(new ApiError("Create store advertisement",400))
                        const imagesUrl = await storage.Upload(files,_data._id);
                        let str = await Promise.all(imagesUrl).then(d => d );
                        await Data.updateOne({ _id: _data._id},{ $push: { img: str }})
                        let p_ads = await Payment.create({
                            author: buyer_id,
                            basketId:basket_id,
                            paymentId: result.paymentId,
                            price: card_price,
                            paid_price: card_paid_price,
                            ads_id: _data._id,
                            paymentTransactionId: result.itemTransactions[0].paymentTransactionId
                        })
                        if(!p_ads)
                            return next(new ApiError("Create store payment",400))
                        return res.status(200).send({ status: true, message: "Add Advertisement data save success", data: result})
                    }
                }
            })
        }
        if(ads_time === "1m"){
            await iyzipay.payment.create(request,async function(err,result) {
                if(result.status === "failure")
                    return next(new ApiError(result.errorMessage,400))
                if(result.status === "success"){
                    if(true){
                        let _data = await Data.create({
                            ...body,
                            author: userData.id,
                            authCode: result.authCode,
                            banner_story_time: new Date(+new Date()+30*24*60*60*1000),
                            location: {
                                coordinates: [ parseFloat(store.location.coordinates[0]),parseFloat(store.location.coordinates[1]) ]
                            }
                        });
                        if(!_data)
                            return next(new ApiError("Create store advertisement",400))
                        const imagesUrl = await storage.Upload(files,_data._id);
                        let str = await Promise.all(imagesUrl).then(d => d );
                        await Data.updateOne({ _id: _data._id},{ $push: { img: str }})
                        let p_ads = await Payment.create({
                            author: buyer_id,
                            basketId:basket_id,
                            paymentId: result.paymentId,
                            price: card_price,
                            paid_price: card_paid_price,
                            ads_id: _data._id,
                            paymentTransactionId: result.itemTransactions[0].paymentTransactionId
                        })
                        if(!p_ads)
                            return next(new ApiError("Create store payment",400))
                        return res.status(200).send({ status: true, message: "Add Advertisement data save success", data: result})
                    }
                }
            })
        }
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