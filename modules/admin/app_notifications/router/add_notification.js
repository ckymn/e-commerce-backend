const Data = require("../model")

const route = async (req, res, next) => {
    try {
        let { body } = req;

        let data = await new Data({
            ...body,
        });
        if(!data)
            return res.status(404).send({ status: false, message: "Add Application Notification Failed"})
        await data.save();
        return res.status(200).send({ status: true, message: "Add Application Notification success", data })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `Add Admin Banner Error , Something Missing => ${error}`})
    }
}

module.exports = route