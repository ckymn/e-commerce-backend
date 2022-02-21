const Data = require("../../auth/model")


const route = async (req, res, next) => {
    try {
        let { id } = req.userData;
        let _data = await Data.findOne({ _id: id }).lean();
        let D = _data.created_at
        let s_D = new Date();
        let oneDay = 24 * 60 * 60 * 1000; 
        let remain_day = 30 - (Math.round(Math.abs((D-s_D)/oneDay)))
        await Data.findOneAndUpdate({ _id: id },{ $set: {remain_date: remain_day }},{ new:true }, (err,doc) => {
            if(err)
                console.log("date error")
            console.log(doc)
        }).clone()
        if(!_data)
            return res.status(404).send({ status: false, message: "Not Found Information about Seller"});
        return res.status(200).send({ status: true, message: "Seller Information success", data: _data })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!: ${error} `})
        }
        return res.status(500).send({ status: false, message: `Get Information Seller Cannot Upload , Something Missing => ${error}`})
    }
}

module.exports = route