const { Sector, Category_One, Category_Two, Category_Three, Category_Four, Category_Five } = require("../model")

const route = async (req,res,next) => {
    try {
        let _sector = await Sector.find({}).lean().exec(); 
        if(!_sector) return res.status(404).send({ status: false, message: "Sector data filed"})
        let _c_one = await Category_One.find({}).lean().exec(); 
        if(!_c_one) return res.status(404).send({ status: false, message: "Category One data filed"})
        let _c_two = await Category_Two.find({}).lean().exec(); 
        if(!_c_two) return res.status(404).send({ status: false, message: "Category Two data filed"})
        let _c_three = await Category_Three.find({}).lean().exec(); 
        if(!_c_three) return res.status(404).send({ status: false, message: "Cateogry Three data filed"})
        let _c_four = await Category_Four.find({}).lean().exec(); 
        if(!_c_four) return res.status(404).send({ status: false, message: "Category Four data filed"})
        let _c_five = await Category_Five.find({}).lean().exec(); 
        if(!_c_five) return res.status(404).send({ status: false, message: "Category Five data filed"})
        
        return res.status(200).send({ status: true, message: " Sector data success" , data: { _sector, _c_one, _c_two, _c_three, _c_four, _c_five }})
    } catch (error) {
       return res.status(500).send({ status: false, message: `Admin GetSectors ${error}`});
    }
    
};
module.exports = route
