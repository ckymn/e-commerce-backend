const express = require("express")
const router = express.Router();

//image upload
const { uploadImage } = require("../utils")

//middleware
const middleware = require("../middlewares");

//user_get
const user_auth = require("../modules/user/auth/router")
const user_comment = require("../modules/user/comment/router")
const user_profile = require("../modules/user/profile/router")
const user_home = require("../modules/user/user_home/router");
const user_follow = require("../modules/user/follow/rotuer")
const user_star = require("../modules/user/star/router")
const user_favorite = require("../modules/user/favorite/router")

// users_get
router.get(`/user/logout`, middleware.authJwt, user_auth.logout);
router.get(`/user/home_page`, middleware.authJwt, middleware.active.active,user_home.home_page)
router.get(`/user/user`, middleware.authJwt, user_home.user)
router.get(`/user/storie/:id`,middleware.idChecker(), middleware.authJwt, user_home.view_story)
router.get(`/user/product/:id`,middleware.idChecker(), middleware.authJwt, user_home.single_product)
router.get(`/user/favorites`, middleware.authJwt, user_favorite.all_favorite)
router.get(`/user/stores`, middleware.authJwt, user_home.stores)
router.get(`/user/store/:id`,middleware.idChecker(), middleware.authJwt, user_home.single_store)
router.get(`/user/whatsapp/:id`,middleware.idChecker(), middleware.authJwt, user_home.whatsapp);
router.post(`/user/feedback`, middleware.authJwt, user_profile.feed_back)
router.post(`/user/profile`, middleware.authJwt, user_profile.profile)

 
// user_post
router.post(`/user/login`,user_auth.login)
router.post(`/user/register`,uploadImage.single("img"),user_auth.register)
router.post(`/user/forgot_password`,middleware.authJwt,user_auth.forgot_password)
router.post(`/user/reset_password`,middleware.authJwt,user_auth.reset_password)
router.put(`/user/update_password`,middleware.authJwt,user_auth.update_password)
router.post(`/user/store_comment/:id`,middleware.idChecker(), middleware.authJwt, user_comment.add_store_comment)
router.delete(`/user/store_comment/:id`,middleware.idChecker(), middleware.authJwt, user_comment.delete_store_comment)
router.put(`/user/store_comment/:id`,middleware.idChecker(), middleware.authJwt, user_comment.update_store_comment)
router.post(`/user/product_comment/:id`,middleware.idChecker(), middleware.authJwt, user_comment.add_product_comment)
router.delete(`/user/product_comment/:id`,middleware.idChecker(), middleware.authJwt, user_comment.delete_product_comment)
router.put(`/user/product_comment/:id`,middleware.idChecker(), middleware.authJwt, user_comment.update_product_comment)
router.post(`/user/store_follow/:id`,middleware.idChecker(), middleware.authJwt, user_follow.store_follow)
router.delete(`/user/store_unfollow/:id`,middleware.idChecker(), middleware.authJwt, user_follow.store_unfollow)
router.post(`/user/product_star/:id`,middleware.idChecker(), middleware.authJwt, user_star.add_product_star)
router.delete(`/user/product_star/:id`,middleware.idChecker(), middleware.authJwt, user_star.delete_product_star)
router.put(`/user/product_star/:id`,middleware.idChecker(), middleware.authJwt, user_star.update_product_star)
router.post(`/user/store_star/:id`,middleware.idChecker(), middleware.authJwt, user_star.add_store_star)
router.delete(`/user/store_star/:id`,middleware.idChecker(), middleware.authJwt, user_star.delete_store_star)
router.put(`/user/store_star/:id`,middleware.idChecker(), middleware.authJwt, user_star.update_store_star)
router.post(`/user/product_favorite/:id`,middleware.idChecker(), middleware.authJwt, user_favorite.favorite)

module.exports = router;    