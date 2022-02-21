const { Store_Comment } = require('../../../user/comment/model')

const route = async (req, res) => {
  try {
    let { params } = req;

    await Store_Comment.findOne({ _id: params.id }).lean().exec((err,data) =>{
        if(!data) 
            return res.status(404).send({ status: false, message: "Single Store Comment Notification doesn't found"})
        return res.status(200).send({ status: true, message: "Single Store Comment Notification success", data })
    })
  } catch (error) {
    if(error){
      if(error.name === "MongoError" && error.code === 11000)
          return res.status(500).send({ status: false, message: `Store Comment, File Already exists!  : ${error}` })
    }
    return res.status(500).send({ status: false, message: `Store Comment, Something Missing => ${error}`})
  }
};

module.exports = route;