const Data = require("../../auth/model"),
  Product = require("../../products/model"),
  { Store_Comment, Product_Comment } = require("../../../user/comment/model"),
  Storie = require("../../story/model"),
  Advertisement = require("../../advertisement/model"),
  Store = require("../../auth/model");

const route = async (req, res, next) => {
  try {
    let { userData } = req;
    //1 haftalik : aranma sayisi-wp messajlari-wp mesaj sayisi-konumla aranma sayisi

    let _products = await Product.find({
      $and: [{ author: userData.id }, { is_approved: "yes" }],
    })
      .lean()
      .exec((_, data) => {
        if (!data) {
          return res.status(404).send({
            status: false,
            message: "Store/store_home/home_page ,Don't Match Product Data",
          });
        }
      });
    let _store_comments = await Store_Comment.find({ store_id: userData.id })
      .populate({ path: "author" })
      .lean()
      .exec((_, data) => {
        if (!data) {
          return res.status(404).send({
            status: false,
            message:
              "Store/store_home/home_page ,Don't Match Store Comment Data",
          });
        }
      });
    let _product_comments = await Product.find({
      $and: [{ author: userData.id }, { is_approved: "yes" }],
    })
      .select("comments")
      .populate({ path: "comments" })
      .lean()
      .exec((_, data) => {
        if (!data) {
          return res.status(404).send({
            status: false,
            message:
              "Store/store_home/home_page ,Don't Match Product Comment Data",
          });
        }
      });

    let _stories = await Storie.find({ author: userData.id })
      .populate({ path: "view" })
      .count()
      .lean()
      .exec((_, data) => {
        return res.status(404).send({
          status: false,
          message: "Store/store_home/home_page ,Don't Match Stories Data",
        });
        if (!data) {
        }
      });
    let _ads = await Advertisement.find({
      $and: [{ author: userData.id }, { is_approved: "yes" }],
    })
      .lean()
      .exec((_, data) => {
        if (!data) {
          return res.status(404).send({
            status: false,
            message:
              "Store/store_home/home_page ,Don't Match Advertisement Data",
          });
        }
      });

    let _store_info = await Store.find({
      $and: [{ _id: userData.id }, { is_approved: "yes" }],
    })
      .lean()
      .exec((_, data) => {
        if (!data) {
          return res.status(404).send({
            status: false,
            message:
              "Store/store_home/home_page ,Don't Match Store Informations Data",
          });
        }
      });
    //toplam goruntuleme sayisini mongodb sum'a gore yapma ve * gun - hafta - aya gore siralama
    let _total_view = await Store.find({ is_approved: "yes" })
      .populate({ path: "view" })
      .count()
      .lean()
      .exec((_, data) => {
        if (!data) {
          return res.status(404).send({
            status: false,
            message: "Store/store_home/home_page ,Don't Match Total Views Data",
          });
        }
      });

    let _follow = await Store.find({
      $and: [{ _id: userData.id }, { is_approved: "yes" }],
    })
      .populate({ path: "follow", select: "username" })
      .lean()
      .exec((_, data) => {
        if (!data) {
          return res.status(404).send({
            status: false,
            message: "Store/store_home/home_page ,Don't Match Follow Data",
          });
        }
      });
    return res.status(200).send({
      status: true,
      message: "Store Home Page Success",
      data: {
        _products,
        _store_comments,
        _product_comments,
        _stories,
        _ads,
        _store_info,
        _ads,
        _follow,
        _total_view,
      },
    });
  } catch (error) {
    if (error) {
      if (error.name === "MongoError" && error.code === 11000)
        return res.status(error.code).send({
          status: false,
          message: `Find Store, MongoError Database Already Exist : ${error}`,
        });
    }
    return res
      .status(500)
      .send({ status: false, message: `Find Store, Missing Error : ${error}` });
  }
};
module.exports = route;
