const Data = require("../model")

const route = async (req, res, next) => {
    try {
        let { body , userData } = req;

        let _data = await new Data({
            ...body,
            author: userData.id,
        });
        if(!_data)
            return res.status(404).send({ status: false, message: "Save Advertisement error"})
        if(body.banner_story_time === "1d"){
            await _data.set({
                banner_story_time: new Date(+new Date()+24*60*60*1000)
            })
        }
        if(body.banner_story_time === "5d"){
            await _data.set({
                banner_story_time: new Date(+new Date()+5*24*60*60*1000)
            })
        }
        if(body.banner_story_time === "1w"){
            await _data.set({
                banner_story_time: new Date(+new Date()+7*24*60*60*1000)
            })
        }
        if(body.banner_story_time === "2w"){
            await _data.set({
                banner_story_time: new Date(+new Date()+2*7*24*60*60*1000)
            })
        }
        if(body.banner_story_time === "1m"){
            await _data.set({
                banner_story_time: new Date(+new Date()+4*7*24*60*60*1000)
            })
        }
        await _data.save();
        return res.status(200).send({ status: true, message: "Add Advertisement data save success"})
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `Add Advertisement Error Cannot Upload Something Missing => ${error}`})
    }
}

module.exports = route