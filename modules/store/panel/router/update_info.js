const Data = require("../../auth/model")


const route = async (req, res, next) => {
    try {
        let { id } = req.userData;
        let { name, surname, email, username } = req.body;
        let _data = await Data.findOneAndUpdate({ _id: id },{$set: { name ,surname,email,username }}, { new: true }).lean().exec();
        if(!_data)
            return res.status(400).send({ status: false, message: "Not Update Information about Seller"})
        return res.status(200).send({ status: true, message: "Seller Information Update success", data: _data })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!: ${error} `})
        }
        return res.status(500).send({ status: false, message: `Update Information Seller Cannot Upload , Something Missing => ${error}`})
    }
}

module.exports = route