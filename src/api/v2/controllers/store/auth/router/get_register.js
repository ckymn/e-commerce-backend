const route = async (req,res,next) => {
    try {
        return res.send({ status: 200, message: "Store Register Page"})
    } catch (error) {
        return res.status(500).send({ status: false, message: `Login Page : ${error} `})        
    }
};

module.exports = route;