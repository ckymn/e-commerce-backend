const Data = require("../model")
const storage = require("../../../../uploads/storeStorys")

const route = async (req, res, next) => {
    try {
        let { userData } = req
        let current_time = new Date();

        let data = await Data.find({ author: userData.id });
        let outdate_storys = await Data.find({ story_time: { $lte : current_time } });
        if(outdate_storys.length > 0){
            await Data.deleteMany({ story_time: { $lte: current_time }});
            let n_data = await Data.find({ author: userData.id });
            outdate_storys.map(async i => {
                storage.Delete(i._id)
            })
            return res.status(200).send({ status: true, message: "All Store Storys success and Deleted Outdate storys", data: n_data })
        }else{
            return res.status(400).send({ status: true, message: "All Store Story success and No Match Outdate sotrys", data })
        }
        
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(422).send({ status: false, message: `File Already exists: ${error}`})
        }
        return res.status(422).send({ status: false, message: `Store Add Story ,Something Missing => ${error}`})
    }
}

module.exports = route