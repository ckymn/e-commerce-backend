const route = async (req,res,next) => {
    try {
        return res.status(200).send({ status: true, message: "My Account Page"})
    } catch (error) {
        if(error){
            if(error.message === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `Mongo Already Exist => ${error}`})
        }
        return res.status(500).send({ status: false, message: `My Account Page,  Mongo Error => ${error}`})
    }
};

module.exports = route;