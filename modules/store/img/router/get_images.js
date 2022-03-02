const Data = require("../model");
const storage = require("../../../../uploads/images")

const route = async (req, res) => {
	try {
		let { userData } = req;
		
		await Data.find({ author: userData.id }).lean().exec((err,data) => {
			if(err)
				return res.status(400).send({ status: false, message: `Store Images get from product failed : ${err}` })
			return res.status(200).send({ status: true, message: `Store Images get from product success`, data })
		})
	} catch (error) {
		return res.status(500).send({ status: false, message: `Get Images from products of stores failed : ${error}`})
	}
};

module.exports = route;