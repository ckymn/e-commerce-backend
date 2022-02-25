const { Sector, Category_One, Category_Two, Category_Three, Category_Four, Category_Five } = require("../../../admin/sector/model");

const route = async (req,res) => {
    try {
        let { sector_name, category_one, category_two, category_three, category_four, category_five } = req.body;
        if(global){
            let _sector_name = await Sector.aggregate([ 
                { $match: { $text: { $search: global } } },
                { $project: { _id: 0, sector_name: 1, category_one: 1 }},
            ]);
            let _category_one = await Category_One.aggregate([
                { $match: { $text: { $search: global } } },
                { $project: { _id: 0, category_one: 1, category_two: 1 }}
            ])  
            let _category_two = await Category_Two.aggregate([
                { $match: { $text: { $search: global  } } },
                { $project: { _id: 0, category_two: 1, category_three: 1 }}
            ]) 
            let _category_three = await Category_Three.aggregate([
                { $match: { $text: { $search: global  } } },
                { $project: { _id: 0, category_three: 1, category_four: 1 }}
            ]) 
            let _category_four = await Category_Four.aggregate([
                { $match: { $text: { $search: global  } } },
                { $project: { _id: 0, category_four: 1, category_five: 1 }}
            ]) 
            let _category_five = await Category_Five.aggregate([
                { $match: { $text: { $search: global  } } },
                { $project: { _id: 0, category_four: 1, category_five: 1 }}
            ]) 
            return res.status(200).send({ status: true, message: "SectorName success", data: {_sector_name, _category_one, _category_two, _category_three, _category_four , _category_five}})
        }
        if(sector_name){
            let _sector_name = await Sector.aggregate([ 
                { $match: { $text: { $search: sector_name } } },
                { $project: { _id: 0, sector_name: 1, category_one: 1 }},
            ]);
            return res.status(200).send({ status: true, message: "SectorName success", data: _sector_name })
        }
        if(category_one){
            let _category_one = await Category_One.aggregate([
                { $match: { $text: { $search: category_one } } },
                { $project: { _id: 0, category_one: 1, category_two: 1 }}
            ]) 
            return res.status(200).send({ status: true, message: "SectorName success", data: _category_one })
        }
        if(category_two){
            let _category_two = await Category_Two.aggregate([
                { $match: { $text: { $search: category_two } } },
                { $project: { _id: 0, category_two: 1, category_three: 1 }}
            ]) 
            return res.status(200).send({ status: true, message: "SectorName success", data: _category_two })
        }
        if(category_three){
            let _category_three = await Category_Three.aggregate([
                { $match: { $text: { $search: category_three } } },
                { $project: { _id: 0, category_two: 1, category_three: 1 }}
            ]) 
            return res.status(200).send({ status: true, message: "SectorName success", data: _category_three })
        }
        if(category_four){
            let _category_four = await Category_Four.aggregate([
                { $match: { $text: { $search: _category_four } } },
                { $project: { _id: 0, category_two: 1, category_three: 1 }}
            ]) 
            return res.status(200).send({ status: true, message: "SectorName success", data: _category_four })
        }
        if(category_five){
            let _category_five = await Category_Five.aggregate([
                { $match: { $text: { $search: _category_five } } },
                { $project: { _id: 0, category_two: 1, category_three: 1 }}
            ]) 
            return res.status(200).send({ status: true, message: "SectorName success", data: _category_five})
        }
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `Store Get Click,  Something Missing => ${error}`})
    }
}

module.exports = route;