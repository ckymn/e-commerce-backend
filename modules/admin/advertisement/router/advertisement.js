const Data = require("../model")
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
    try {
        let { body} = req;
        let { ads_time } = body;
       
        if(ads_time === "1d"){
            let data = await Data.create({
                ...body,
                location:{
                    coordinates: [parseFloat(body.long),parseFloat(body.lat)]
                },
                banner_story_time: new Date(+new Date()+24*60*60*1000)
            });
            return res.status(200).send({ status: true, message: "Admin Add Advertisement success", data })
        }
        if(ads_time === "5d"){
            let data = await new Data({
                ...body,
                location:{
                    coordinates: [parseFloat(body.long),parseFloat(body.lat)]
                },
                banner_story_time: new Date(+new Date()+5*24*60*60*1000)
            })
            return res.status(200).send({ status: true, message: "Admin Add Advertisement success", data })
        }
        if(ads_time === "1w"){
            let data = await new Data({
                ...body,
                location:{
                    coordinates: [parseFloat(body.long),parseFloat(body.lat)]
                },
                banner_story_time: new Date(+new Date()+7*24*60*60*1000)
            })
            return res.status(200).send({ status: true, message: "Admin Add Advertisement success", data })
        }
        if(ads_time === "2w"){
            let data = await new Data({
                ...body,
                location:{
                    coordinates: [parseFloat(body.long),parseFloat(body.lat)]
                },
                banner_story_time: new Date(+new Date()+14*24*60*60*1000)
            })
            return res.status(200).send({ status: true, message: "Admin Add Advertisement success", data})
        }
        if(ads_time === "1m"){
            let data = await new Data({
                ...body,
                location:{
                    coordinates: [parseFloat(body.long),parseFloat(body.lat)]
                },
                banner_story_time: new Date(+new Date()+30*24*60*60*1000)
            })
            return res.status(200).send({ status: true, message: "Admin Add Advertisement success", data })
        }
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 500));
        }
        next(new ApiError(error?.message));
    }
    
}

module.exports = route