const Data = require("../model");
const storage = require("../../../../uploads/images")

const route = async (req, res) => {
	try {
        let {userData,arr} = req    

        arr.map(async i => {
            await Data.deleteOne({ $and:[{ author: userData.id },{ _id: i.imageId }]}).exec(async (err,data) => {
                if(!data) {
				    return res.status(400).send({ status: false, message: `Store Single Images delete from product failed : ${err}` })
                }else{
                    await storage.Delete(i.imageId)
                    return res.status(200).send({ status: true, message: `Store Single Images delete from product success`, data: data })
                }
            })
        })
	} catch (error) {
		if (error.name === "MongoError" && error.code === 11000) {
            return res
              .status(500)
              .send({ status: false, message: `File Already exists!  : ${error}` });
          } else {
            return res
              .status(500)
              .send({
                status: false,
                message: `Delete Images Error , Something Missing => ${error}`,
              });
          }
	}
};

module.exports = route;