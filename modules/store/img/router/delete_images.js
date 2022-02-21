const Data = require("../../products/model");
const storage = require("../../../../uploads/products")

const route = async (req, res) => {
	try {
        let username = req.userData.sub;
        let u_id = req.userData.id            
        
		await Data.updateMany({ author: u_id }, {
            $pullAll: {
                images: req.body
            }
        }).lean().exec(async (err,data) => {
			if(err)
				return res.status(400).send({ status: false, message: `Store Single Images delete from product failed : ${err}` })
            // storage
            await storage.SingleDelete(username,req.body)
            return res.status(200).send({ status: true, message: `Store Single Images delete from product success`, data: data })
		})
	} catch (error) {
		return res.status(500).send({ status: false, message: `Delete Store Single Images from products of stores failed : ${errro}`})
	}
};

module.exports = route;