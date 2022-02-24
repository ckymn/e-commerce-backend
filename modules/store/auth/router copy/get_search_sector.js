const { Sector, Category_One, Category_Two, Category_Three, Category_Four, Category_Five } = require("../../../admin/sector/model");

const route = async (req,res) => {
    try {
        let { global, sector_name, category_one, category_two, category_three, category_four, category_five } = req.body;
        let _sector_name = await Sector.aggregate([
            { $match: { $text: { $search: global || sector_name } } },
            { $project: { sector_name: 1, category_one: 1 }},
        ])
        let _category_one = await Category_One.aggregate([
            { $match: { $text: { $search: global || category_one } } },
            { $project: { category_one: 1, category_two: 1 }}
        ])
        let _category_two = await Category_Two.aggregate([
            { $match: { $text: { $search: global || category_two } } },
            { $project: { category_two: 1, category_three: 1 }}
        ])
        let _category_three = await Category_Three.aggregate([
            { $match: { $text: { $search: global || category_three } } },
            { $project: { category_three: 1, category_four: 1 }}
        ])
        let _category_four = await Category_Four.aggregate([
            { $match: { $text: { $search: global || category_four } } },
            { $project: { category_four: 1, category_five: 1 }}
        ])
        let _category_five = await Category_Five.aggregate([
            { $match: { $text: { $search: global || category_five } } },
            { $project: { category_five: 1 }}
        ])
        return res.status(200).send({ status: true, message: "Search Categories success" ,data: { 
            _sector_name,_category_one ,_category_two, _category_three, _category_four, _category_five
        }})
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `Store Add Products Error Cannot Upload Something Missing => ${error}`})
    }
}

module.exports = route; 