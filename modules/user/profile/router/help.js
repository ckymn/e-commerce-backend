const route = async (req,res,next) => {
    try {
        return res.status(200).send({ status: true, message: "Help Page"})
    } catch (error) {
        if(error)
            return res.status(500).send({ status: false, message: `Something Error ${error}`})
    }
};

module.exports = route;