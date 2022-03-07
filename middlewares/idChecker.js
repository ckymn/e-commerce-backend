const ApiError = require("../errors/ApiError")

const idChecker = (filed) => (req,res,next) => {

    if(!req?.params[filed || "id"]?.match(/^[0-9a-fA-F]{24}$/)){
        return next(new ApiError("Lutfen gecerli bir Id bilgisi giriniz",400));
    }
    next();
};

module.exports = idChecker;