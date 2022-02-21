const Data = require("../model")

const route = async (req, res, next) => {
    try {
        let { id } = req.params;
        let u_id = req.userData.id;
        let s_d = await Data.findOne({ $and: [ { author: u_id }, { _id: id } ] })
            .populate({ path: 'comments', 
                populate:{
                    path: 'author',
                    select: 'name surname'
                },
                options: { lean: true}
            })
            .populate({ path: 'star', select: 'rate' ,options: { lean: true}})
            .lean().exec();
        if(!s_d)
            return res.status(404).send({ status: false, message: "Single product find error"})
        return res.status(200).send({ status: true, message: "Single product search success", data: s_d })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `Single Products Error Cannot Upload Something Missing => ${error}`})
    }
}

module.exports = route