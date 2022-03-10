const express = require("express")
const router = express.Router();

//middleware
const {
  authJwt,
  active,
  uploadImage,
  idChecker,
  ip_mid,
  validate,
  errorHandler,
} = require("../middlewares");
//validations
const schemas = require("../validations/admin");

//user_get
const user_auth = require("../modules/user/auth/router")
const user_comment = require("../modules/user/comment/router")
const user_profile = require("../modules/user/profile/router")
const user_home = require("../modules/user/user_home/router");
const user_follow = require("../modules/user/follow/rotuer")
const user_star = require("../modules/user/star/router")
const user_favorite = require("../modules/user/favorite/router")

// users_get
router.get(`/user/logout`, authJwt, user_auth.logout);
router.get(`/user/home_page`, authJwt, active.active,user_home.home_page)
router.get(`/user/user`, authJwt, user_home.user)
router.get(`/user/storie/:id`,idChecker(), authJwt, user_home.view_story)
router.get(`/user/product/:id`,idChecker(), authJwt, user_home.single_product)
router.get(`/user/favorites`, authJwt, user_favorite.all_favorite)
router.get(`/user/stores`, authJwt, user_home.stores)
router.get(`/user/store/:id`,idChecker(), authJwt, user_home.single_store)
router.get(`/user/whatsapp/:id`,idChecker(), authJwt, user_home.whatsapp);
router.post(`/user/feedback`, authJwt, user_profile.feed_back)
router.post(`/user/profile`, authJwt, user_profile.profile)

 
// user_post
router.post(`/user/register`,uploadImage.single("img"),user_auth.register)
router.post(`/user/login`,user_auth.login)
router.post(`/user/forgot_password`,authJwt,user_auth.forgot_password)
router.post(`/user/reset_password`,authJwt,user_auth.reset_password)
router.put(`/user/update_password`,authJwt,user_auth.update_password)
router.post(`/user/store_comment/:id`,idChecker(), authJwt, user_comment.add_store_comment)
router.delete(`/user/store_comment/:id`,idChecker(), authJwt, user_comment.delete_store_comment)
router.put(`/user/store_comment/:id`,idChecker(), authJwt, user_comment.update_store_comment)
router.post(`/user/product_comment/:id`,idChecker(), authJwt, user_comment.add_product_comment)
router.delete(`/user/product_comment/:id`,idChecker(), authJwt, user_comment.delete_product_comment)
router.put(`/user/product_comment/:id`,idChecker(), authJwt, user_comment.update_product_comment)
router.post(`/user/store_follow/:id`,idChecker(), authJwt, user_follow.store_follow)
router.delete(`/user/store_unfollow/:id`,idChecker(), authJwt, user_follow.store_unfollow)
router.post(`/user/product_star/:id`,idChecker(), authJwt, user_star.add_product_star)
router.delete(`/user/product_star/:id`,idChecker(), authJwt, user_star.delete_product_star)
router.put(`/user/product_star/:id`,idChecker(), authJwt, user_star.update_product_star)
router.post(`/user/store_star/:id`,idChecker(), authJwt, user_star.add_store_star)
router.delete(`/user/store_star/:id`,idChecker(), authJwt, user_star.delete_store_star)
router.put(`/user/store_star/:id`,idChecker(), authJwt, user_star.update_store_star)
router.post(`/user/product_favorite/:id`,idChecker(), authJwt, user_favorite.favorite)

module.exports = router;    