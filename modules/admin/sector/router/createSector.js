const { Sector ,Category_One, Category_Two, Category_Three, Category_Four,Category_Five } = require("../model");
const ApiError  = require("../../../../errors/ApiError")

const route = async (req, res,next) => {
    try {
        let { adminData , body } = req;
        let { sector_name, category_one,category_two,category_three,category_four,category_five } = body;

            await Sector.findOne({ sector_name }).lean().exec(async (err,data) => {
                let c_sector;
                if(!data || data.length === 0){
                  c_sector = await Sector.create({ sector_name });
                }
                if(category_one){
                    await Category_One.findOne({ category_one }).lean().exec(async (err,data) => {
                        let c_category_one;
                        if(!data || data.length === 0){
                            let sectorId = await Sector.findOne({ sector_name }).lean();
                            c_category_one = await Category_One.create({ 
                                category_one,
                                futures: body.category_one_futures,
                                parent_id: sectorId._id
                            })
                            let o_sector = await Sector.findOneAndUpdate( { sector_name },
                              {
                                $push: {
                                  category_one,
                                  child_id: c_category_one._id,
                                },
                              },
                              { new: true }
                            );
                            if(!o_sector)
                                return next(new ApiError("Sector dont match",400,[]));
                        }
                        if(category_two){
                            await Category_Two.findOne({ category_two }).lean().exec(async (err,data) => {
                                let c_category_two;
                                if(!data || data.length === 0){
                                    let category_one_Id = await Category_One.findOne({ category_one }).lean();
                                    c_category_two = await Category_Two.create({ 
                                        category_two,
                                        futures: body.category_two_futures,
                                        parent_id: category_one_Id._id
                                    })
                                    let o_category_one = await Category_One.findOneAndUpdate({ category_one },
                                        {
                                          $push: {
                                            category_two,
                                            child_id: c_category_two._id,
                                          },
                                        },
                                        { new: true }
                                      );
                                    if(!o_category_one)
                                        return next(new ApiError("Category One  dont match",400,[]));
                                }
                                if(category_three){
                                    await Category_Three.findOne({ category_three }).lean().exec(async (err,data) => {
                                        let c_category_three;
                                        if(!data || data.length === 0){
                                            let category_two_Id = await Category_Two.findOne({ category_two }).lean();
                                            c_category_three = await Category_Three.create({ 
                                                category_three,
                                                futures: body.category_three_futures,
                                                parent_id: category_two_Id._id 
                                            })
                                            let o_caegory_two = await Category_Two.findOneAndUpdate({ category_two },
                                                {
                                                  $push: {
                                                    category_three,
                                                    child_id: c_category_three._id,
                                                  },
                                                },
                                                { new: true }
                                              );
                                            if(!o_caegory_two)
                                                return next(new ApiError("Category Two dont match",400,[]));
                                        }
                                        if(category_four){
                                            await Category_Four.findOne({ category_four }).lean().exec(async (err,data) => {
                                                let c_category_four;
                                                if(!data || data.length === 0){
                                                    let category_three_Id = await Category_Three.findOne({ category_three }).lean();
                                                    c_category_four = await Category_Four.create({ 
                                                        category_four ,
                                                        futures: body.category_four_futures,
                                                        parent_id: category_three_Id._id 
                                                    });
                                                    let o_category_four = await Category_Three.findOneAndUpdate({ category_three },
                                                        {
                                                          $push: {
                                                            category_four,
                                                            child_id : c_category_four._id,
                                                          },
                                                        },
                                                        { new: true }
                                                      );
                                                    if(!o_category_four)
                                                        return next(new ApiError("Category Three dont match",400,[]));
                                                }
                                                if(category_five){
                                                    await Category_Five.findOne({ category_five }).lean().exec(async (err,data) => {
                                                    let c_category_five;
                                                    if(!data || data.length === 0){
                                                        let category_four_Id = await Category_Four.findOne({ category_four }).lean();
                                                        c_category_five = await Category_Five.create({ 
                                                            category_five ,
                                                            futures: body.category_five_futures.map(i => i),
                                                            parent_id: category_four_Id._id 
                                                        })
                                                        let o_category_five = await Category_Four.findOneAndUpdate({ category_four },
                                                            {
                                                              $push: {
                                                                category_five,
                                                              },
                                                            },
                                                            { new: true }
                                                          );
                                                        if(!o_category_five)
                                                            return next(new ApiError("Category Four dont match",400,[])); 
                                                    }else{
                                                        return res.send({ status: 200, message: "Sectors Success" , data: { c_sector , c_category_two, c_category_three, c_category_four }});
                                                    }
                                                })}
                                                if(!category_five){
                                                    return res.send({ status: 200, message: "Sectors Success" , data: { c_sector , c_category_two, c_category_three, c_category_four }})
                                                }
                                            })
                                        }
                                        if(!category_four){
                                          return res.send({ status: 200, message: "Sectors Success" , data: { c_sector , c_category_two, c_category_three }})
                                        }
                                    })
                                }
                                if(!category_three){
                                  return res.send({ status: 200, message: "Sectors Success" , data: { c_sector , c_category_one, c_category_two }})
                                }
                            });
                        }
                        if(!category_two){
                          return res.send({ status: 200, message: "Sectors Success" , data: { c_sector,c_category_one }})
                        }
                    });
                }
                if(!category_one){
                  return res.send({
                    status: 200,
                    message: "Sectors Success",
                    data: { c_sector },
                  });
                }
            })
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 204, []));
        }
        next(new ApiError(error?.message));
    }
  
};

module.exports = route;