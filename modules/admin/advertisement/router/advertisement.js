const Data = require("../model")
const storage = require("../../../../uploads/adminStoryAds")
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
    try {
        let { files , body , adminData} = req;
        let { ads_time } = body;
        if(files.length === 0){
            return next(new ApiError("No file uploaded",400));
        }
        else{
            if(ads_time === "1d"){
                let data = await new Data({
                    ...body,
                    location:{
                        coordinates: [parseFloat(body.long),parseFloat(body.lat)]
                    },
                    banner_story_time: new Date(+new Date()+24*60*60*1000)
                });
                const imagesUrl = await storage.Upload(files,data._id);
                let str = await Promise.all(imagesUrl).then(d => d );
                await data.set({
                    img: str.map( i => i)
                })
                await data.save();
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
                const imagesUrl = await storage.Upload(files,data._id);
                let str = await Promise.all(imagesUrl).then(d => d );
                await data.set({
                    img: str.map( i => i)
                })
                await data.save();
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
                if(!data)
                    return next(new ApiError("Admin create advertisement",400));
                const imagesUrl = await storage.Upload(files,data._id);
                let str = await Promise.all(imagesUrl).then(d => d );
                await data.set({
                    img: str.map( i => i)
                })
                await data.save();
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
                const imagesUrl = await storage.Upload(files,data._id);
                let str = await Promise.all(imagesUrl).then(d => d );
                await data.set({
                    img: str.map( i => i)
                })
                await data.save();
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
                if(!data)
                    return next(new ApiError("Admin create advertisement",400));
                const imagesUrl = await storage.Upload(files,data._id);
                let str = await Promise.all(imagesUrl).then(d => d );
                await data.set({
                    img: str.map( i => i)
                })
                await data.save();
                return res.status(200).send({ status: true, message: "Admin Add Advertisement success", data })
            }
        }
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 500, null));
        }
        next(new ApiError(error?.message, 500));
    }
    
}

module.exports = route