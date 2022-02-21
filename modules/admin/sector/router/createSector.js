const { Sector ,Category_One, Category_Two, Category_Three, Category_Four,Category_Five } = require("../model");

const route = async (req, res) => {
    try {
        let { adminData , body } = req;
        let { sector_name, category_one,category_two,category_three,category_four,category_five } = body;
            await Sector.findOne({ sector_name }).lean().exec(async (err,data) => {
                if(!data || data.length === 0){
                    let c_sector = await new Sector({ sector_name }).save();
                    if(!c_sector)
                        return res.status(400).send({ status: false, message: "Create Sector Something Error !"})
                }
                if(category_one){
                    await Category_One.findOne({ category_one }).lean().exec(async (err,data) => {
                        if(!data || data.length === 0){
                            let sectorId = await Sector.findOne({ sector_name }).lean();
                            let c_category_one = await new Category_One({ 
                                category_one,
                                parent_id: sectorId._id
                            }).save();
                            if(!c_category_one)
                                return res.status(400).send({ status: false, message: "Create Category One Something Error !"})
                            let o_sector = await Sector.findOneAndUpdate({ sector_name },{ $push: { category_one }}, { new: true })
                            if(!o_sector)
                                return res.status(400).send({ status: false, message: "Push Category One Something Error !"})
                        }
                        if(category_two){
                            await Category_Two.findOne({ category_two }).lean().exec(async (err,data) => {
                                if(!data || data.length === 0){
                                    let sectorId = await Sector.findOne({ sector_name }).lean();
                                    let c_category_two = await new Category_Two({ 
                                        category_two,
                                        parent_id: sectorId._id
                                    }).save();
                                    if(!c_category_two)
                                        return res.status(400).send({ status: false, message: "Create Category Two Something Error !"})
                                    let o_category_one = await Category_One.findOneAndUpdate({ category_one },{ $push: { category_two }}, { new: true })
                                    if(!o_category_one)
                                        return res.status(400).send({ status: false, message: "Push Category Two Something Error !"})
                                }
                                if(category_three){
                                    await Category_Three.findOne({ category_three }).lean().exec(async (err,data) => {
                                        if(!data || data.length === 0){
                                            let sectorId = await Sector.findOne({ sector_name }).lean();
                                            let c_category_three = await new Category_Three({ 
                                                category_three,
                                                parent_id: sectorId._id 
                                            }).save();
                                            if(!c_category_three)
                                                return res.status(400).send({ status: false, message: "Create Category Three Something Error !"})
                                            let o_caegory_two = await Category_Two.findOneAndUpdate({ category_two },{ $push: { category_three }}, { new: true })
                                            if(!o_caegory_two)
                                                return res.status(400).send({ status: false, message: "Push Category Three Something Error !"})
                                        }
                                        if(category_four){
                                            await Category_Four.findOne({ category_four }).lean().exec(async (err,data) => {
                                                if(!data || data.length === 0){
                                                    let sectorId = await Sector.findOne({ sector_name }).lean();
                                                    let c_category_four = await new Category_Four({ 
                                                        category_four ,
                                                        parent_id: sectorId._id 
                                                    }).save();
                                                    if(!c_category_four)
                                                        return res.status(400).send({ status: false, message: "Create Category Four Something Error !"})
                                                    let o_category_four = await Category_Three.findOneAndUpdate({ category_three }, { $push: { category_four }}, { new: true })
                                                    if(!o_category_four)
                                                        return res.status(400).send({ status: false, message: "Push Category Four Something Error !"})
                                                }
                                                if(category_five){
                                                    await Category_Five.findOne({ category_five }).lean().exec(async (err,data) => {
                                                    if(!data || data.length === 0){
                                                        let sectorId = await Sector.findOne({ sector_name }).lean();
                                                        let c_category_five = await new Category_Five({ 
                                                            category_five ,
                                                            parent_id: sectorId._id 
                                                        }).save();
                                                        if(!c_category_five)
                                                            return res.status(400).send({ status: false, message: "Create Category Five Something Error !"})
                                                        let o_category_five = await Category_Four.findOneAndUpdate({ category_four }, { $push: { category_five }}, { new: true })
                                                        if(!o_category_five)
                                                            return res.status(400).send({ status: false, message: "Push Category Five Something Error !"})
                                                    }
                                                })}
                                            })
                                        }
                                    })
                                }
                            });
                        }
                    });
                }
            })
            return res.status(200).send({ status: true, message: "Sectors Success" })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(error.code).send({ status: false, message: `Create Sector, MongoError Database Already Exist : ${error}` })
        }
        return res.status(500).send({ status: false, message: `Create Sector : ${error}` })
    }
  
};

module.exports = route;