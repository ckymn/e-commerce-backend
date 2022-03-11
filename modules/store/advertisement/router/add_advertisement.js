const Store = require("../../auth/model")
const Data = require("../model")
const Payment = require("../../payment/model")
const {iyzipay, pay_form_ads} = require("../../../../utils/iyzipay")
const { v4: uuidv4 } = require('uuid');
const ApiError = require("../../../../errors/ApiError")
const {sendEmailToVitrin} = require("../../../../utils")
const route = async (req, res, next) => {
    try {
        let { body , userData ,files} = req;

        let user = await Store.findOne({ _id: userData.id }).lean();
        let data = await Data.create({ 
            ... body ,
            author: userData.id
        });

        let mail = await sendEmailToVitrin(
          user.email,
          ` Vitrin Store Advertisement Request  `
          `author: ${userData.id} - ads_which: ${body.ads_which} - ads_time: ${body.ads_time} - ads_price: ${body.ads_price} - phone: ${body.phone}`
        );
        if(mail != 200)
            return next(new ApiError(mail.message,mail.status,null));
        return res.status(200).send({ status: true , message:"Your request is success, ", data})
        // let store = await Store.findOne({ _id: userData.id });
        // if(!store)
        //     return next(new ApiError("Store Not Found",404))
        // if(ads_time === "1d"){
        //     let data = await Data.create({
        //         ...body,
        //         img: body.img,
        //         author: userData.id,
        //         banner_story_time: new Date(+new Date()+24*60*60*1000),
        //         location: {
        //             coordinates: [ parseFloat(store.location.coordinates[0]),parseFloat(store.location.coordinates[1]) ]
        //         }
        //     });
        //     return res.status(200).send({ status: true, message: "Add Advertisement data save success", data})
        // }
        // if(ads_time === "5d"){
        //     let data = await Data.create({
        //         ...body,
        //         img: body.img,
        //         author: userData.id,
        //         banner_story_time: new Date(+new Date()+5*24*60*60*1000),
        //         location: {
        //             coordinates: [ parseFloat(store.location.coordinates[0]),parseFloat(store.location.coordinates[1]) ]
        //         }
        //     });
        //     return res.status(200).send({ status: true, message: "Add Advertisement data save success", data})
        // }
        // if(ads_time === "1w"){
        //     let data = await Data.create({
        //         ...body,
        //         img: body.img,
        //         author: userData.id,
        //         banner_story_time: new Date(+new Date()+7*24*60*60*1000),
        //         location: {
        //             coordinates: [ parseFloat(store.location.coordinates[0]),parseFloat(store.location.coordinates[1]) ]
        //         }
        //     });
        //     return res.status(200).send({ status: true, message: "Add Advertisement data save success", data})
        // }
        // if(ads_time === "2w"){

        //     let data = await Data.create({
        //         ...body,
        //         img: body.img,
        //         author: userData.id,
        //         banner_story_time: new Date(+new Date()+2*7*24*60*60*1000),
        //         location: {
        //             coordinates: [ parseFloat(store.location.coordinates[0]),parseFloat(store.location.coordinates[1]) ]
        //         }
        //     });
        //     return res.status(200).send({ status: true, message: "Add Advertisement data save success", data})
        // }
        // if(ads_time === "1m"){
        //     let data = await Data.create({
        //         ...body,
        //         img: body.img,
        //         author: userData.id,
        //         banner_story_time: new Date(+new Date()+30*24*60*60*1000),
        //         location: {
        //             coordinates: [ parseFloat(store.location.coordinates[0]),parseFloat(store.location.coordinates[1]) ]
        //         }
        //     });
        //     return res.status(200).send({ status: true, message: "Add Advertisement data save success", data})
        // }

    } catch (error) {
        console.log(error)
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 204,null));
        }
        next(new ApiError(error?.message));
    }
}

module.exports = route