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

    let _sector_name = await Sector.aggregate([
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
    let _category_one = await Category_One.aggregate([
      { $match: {
        $or: [
          // { $text: { $search: global } },
          { category_one: { $regex: global, $options: "i" } },
        ],
      }, },
      { $project: { category_one: 1, category_two: 1 , parent_id: 1, child_id: 1} },
    ]);
    let _category_two = await Category_Two.aggregate([
      { $match: {
        $or: [
          // { $text: { $search: global } },
          { category_two: { $regex: global, $options: "i" } },
        ],
      }, },
      { $project: { category_two: 1, category_three: 1 , parent_id: 1, child_id: 1} },
    ]);
    let _category_three = await Category_Three.aggregate([
      { $match: {
        $or: [
          // { $text: { $search: global } },
          { category_three: { $regex: global, $options: "i" } },
        ],
      }, },
      { $project: { category_three: 1, category_four: 1 , parent_id: 1, child_id: 1} },
    ]);
    let _category_four = await Category_Four.aggregate([
      { $match: {
        $or: [
          // { $text: { $search: global } },
          { category_four: { $regex: global, $options: "i" } },
        ],
      }, },
      { $project: { category_four: 1, category_five: 1 , parent_id: 1, child_id: 1} },
    ]);
    let _category_five = await Category_Five.aggregate([
      { $match: {
        $or: [
          // { $text: { $search: global } },
          { category_five: { $regex: global, $options: "i" } },
        ],
      }, },
      { $project: { parent_id : 1, category_five: 1 } },
    ]);
    
    return res.status(200).send({
      status: true,
      message: "Search Categories success",
      data: {
        _sector_name,
        _category_one,
        _category_two,
        _category_three,
        _category_four,
        _category_five,
      },
    });
  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      return res
        .status(422)
        .send({ status: false, message: `File Already exists!  : ${error}` });
    } else {
      return res.status(422).send({
        status: false,
        message: `Store Search Sector Error , Something Missing => ${error}`,
      });
    }
  }
};

module.exports = route;
