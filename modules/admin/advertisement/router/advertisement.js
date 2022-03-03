const Data = require("../model")
const storage = require("../../../../uploads/adminStoryAds")

const route = async (req, res, next) => {
    try {
        let { files , body , adminData} = req;
        if(!files)
            return res.status(404).send({ status: true, message: "Firstly you should add image"})
        if(ads_time === "1d"){
            let _data = await new Data({
                ...body,
                banner_story_time: new Date(+new Date()+24*60*60*1000)
            }).save();
            if(!_data)
                return res.status(400).send({ status: false, message: "Admin Add Advertisement doesn't work"})
            const imagesUrl = await storage.Upload(files,_data._id);
            let str = await Promise.all(imagesUrl).then(d => d );
            await Data.updateOne({_id: _data._id},{
                $push: {
                    img: str,
                }
            })
            return res.status(200).send({ status: true, message: "Admin Add Advertisement success", data: _data })
        }
        if(ads_time === "5d"){
            let _data = await new Data({
                ...body,
                banner_story_time: new Date(+new Date()+5*24*60*60*1000)
            }).save();
            if(!_data)
                return res.status(400).send({ status: false, message: "Admin Add Advertisement doesn't work"})
            const imagesUrl = await storage.Upload(files,_data._id);
            let str = await Promise.all(imagesUrl).then(d => d );
            await Data.updateOne({_id: _data._id},{
                $push: {
                    img: str,
                }
            })
            return res.status(200).send({ status: true, message: "Admin Add Advertisement success", data: _data })
        }
        if(ads_time === "1w"){
            let _data = await new Data({
                ...body,
                banner_story_time: new Date(+new Date()+7*24*60*60*1000)
            }).save();
            if(!_data)
                return res.status(400).send({ status: false, message: "Admin Add Advertisement doesn't work"})
            const imagesUrl = await storage.Upload(files,_data._id);
            let str = await Promise.all(imagesUrl).then(d => d );
            await Data.updateOne({_id: _data._id},{
                $push: {
                    img: str,
                }
            })
            return res.status(200).send({ status: true, message: "Admin Add Advertisement success", data: _data })
        }
        if(ads_time === "2w"){
            let _data = await new Data({
                ...body,
                banner_story_time: new Date(+new Date()+14*24*60*60*1000)
            }).save();
            if(!_data)
                return res.status(400).send({ status: false, message: "Admin Add Advertisement doesn't work"})
            const imagesUrl = await storage.Upload(files,_data._id);
            let str = await Promise.all(imagesUrl).then(d => d );
            await Data.updateOne({_id: _data._id},{
                $push: {
                    img: str,
                }
            })
            return res.status(200).send({ status: true, message: "Admin Add Advertisement success", data: _data })
        }
        if(ads_time === "1m"){
            let _data = await new Data({
                ...body,
                banner_story_time: new Date(+new Date()+30*24*60*60*1000)
            }).save();
            if(!_data)
                return res.status(400).send({ status: false, message: "Admin Add Advertisement doesn't work"})
            const imagesUrl = await storage.Upload(files,_data._id);
            let str = await Promise.all(imagesUrl).then(d => d );
            await Data.updateOne({_id: _data._id},{
                $push: {
                    img: str,
                }
            })
            return res.status(200).send({ status: true, message: "Admin Add Advertisement success", data: _data })
        }
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(422).send({ status: false, message: `File Already exists: ${error}`})
        }
        return res.status(422).send({ status: false, message: `Admin Add Advertisement ,Something Missing => ${error}`})
    }
}

module.exports = route