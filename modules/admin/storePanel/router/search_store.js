const Data = require("../../../store/auth/model");

const route = async (req,res,next) => {
    try {
        let { sector , country, city } = req.body;
        await Data.find({ 
            $and: [ 
                { is_approved: { $in: "yes" }},
                { $or: [
                        { sector_name: { $in: sector }},
                        { storecountry: { $in: country }},
                        { storecity: { $in: city }},
                    ]
                }
            ] 
        }).lean().exec((err,data) => {
            console.log(data);
            if(err)
                return res.status(404).send({ status: false, message: "Not Found Store Search Data "})  
            return res.status(200).send({ status: true, message: "Search Store Data success return", data })
        })
    } catch (error) {
        if(error){
            if(error.message === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `Mongo Connect Error => ${error}`})
        }
        return res.status(500).send({ status: false, message: `All Store Notifications => ${error}`})
    }
};

module.exports = route;