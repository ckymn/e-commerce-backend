const {
  Sector,
  Category_One,
  Category_Two,
  Category_Three,
  Category_Four,
  Category_Five,
} = require("../../../admin/sector/model");

const route = async (req, res) => {
  try {
    let { global } = req.body;

    let sector_name = await Sector.aggregate([
      {
        $match: {
          $or: [
            // { $text: { $search: global } },
            { sector_name: { $regex: global, $options: "i" } },
          ],
        },
      },
      { $project: { sector_name: 1, category_one: 1 , parent_id: 1, child_id: 1} },
    ]);
    let category_one = await Category_One.aggregate([
      { $match: {
        $or: [
          // { $text: { $search: global } },
          { category_one: { $regex: global, $options: "i" } },
        ],
      }, },
      { $project: { category_one: 1, category_two: 1 , parent_id: 1, child_id: 1} },
    ]);
    let category_two = await Category_Two.aggregate([
      { $match: {
        $or: [
          // { $text: { $search: global } },
          { category_two: { $regex: global, $options: "i" } },
        ],
      }, },
      { $project: { category_two: 1, category_three: 1 , parent_id: 1, child_id: 1} },
    ]);
    let category_three = await Category_Three.aggregate([
      { $match: {
        $or: [
          // { $text: { $search: global } },
          { category_three: { $regex: global, $options: "i" } },
        ],
      }, },
      { $project: { category_three: 1, category_four: 1 , parent_id: 1, child_id: 1} },
    ]);
    let category_four = await Category_Four.aggregate([
      { $match: {
        $or: [
          // { $text: { $search: global } },
          { category_four: { $regex: global, $options: "i" } },
        ],
      }, },
      { $project: { category_four: 1, category_five: 1 , parent_id: 1, child_id: 1} },
    ]);
    let category_five = await Category_Five.aggregate([
      { $match: {
        $or: [
          // { $text: { $search: global } },
          { category_five: { $regex: global, $options: "i" } },
        ],
      }, },
      { $project: { parent_id : 1, category_five: 1 } },
    ]);
    
    return res.send({
      status: 200,
      message: "Search Categories success",
      data: {
        sector_name,
        category_one,
        category_two,
        category_three,
        category_four,
        category_five,
      },
    });
  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      next(new ApiError(error?.message, 422));
    }
    if (error.code === 27) {
      next(new ApiError("We Don't Have Any Data", 204, null));
    }
    next(new ApiError(error?.message));
  }
};

module.exports = route;
