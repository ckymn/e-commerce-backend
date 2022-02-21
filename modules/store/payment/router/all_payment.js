
const Data = require("../model")

const route = async (req,res,next) => {
    try {
        let { id } = req.userData;

        let _data = await Data.find({ author: id }, "author product_name card_paid_price time status basketId paymentId").lean();
        if(!_data)
            return res.status(404).send({ status: false, message: "You don't have any Oder"})
        return res.status(200).send({ status: true, message: "The Orders were finded", data: _data })
        
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `Store Orders Error Something Missing => ${error}`})
    }
};

module.exports = route;