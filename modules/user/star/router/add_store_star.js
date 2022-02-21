const { Store_Star } = require("../model")
const Store = require("../../../store/auth/model")

const route = async( req,res,next) => {
    try {
        let { body ,kuserData , params} = req;
        await Store_Star.findOne({ $and:[{store_id: params.id},{author: kuserData.id}] })
            .lean().exec(async(err,data) => {
                if(!data){
                    await Store_Star.create({
                        rate: body.rate,
                        author: kuserData.id,
                        store_id: params.id
                    },async (err,data) => {
                        if(err)
                            return res.status(400).send({ status: false, message: "Create Star Error !"})
                        let s_data = await Store.findOneAndUpdate({ _id: params.id },
                            {
                                $push: {
                                    "star": data._id
                                }
                            }, { new: true })
                        if(!s_data)
                            return res.status(400).send({ status: false, message: "Update Store Star Data success "})
                        })
                    return res.status(200).send({ status: true, message: "User to Store Comment Success" })
                }
                return res.status(400).send({ status: false, message: "Add Store Star Already Exist "})
            })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `Mongo Error ${error}`})
        }
        return res.status(500).send({ status: false, message: `User Comment Add of Store, Something Missing Error : ${error}`})
    }
}

module.exports = route