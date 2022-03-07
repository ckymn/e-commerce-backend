
const express = require("express")
const router = express.Router();

//image upload
const { uploadImage } = require("../utils")

//middleware
const middleware = require("../middlewares");
//store_get
const store_home = require("../modules/store/store_home/router")
const sectorSearch = require("../modules/store/auth/router")
const products = require("../modules/store/products/router")
const all_advertisement = require('../modules/store/advertisement/router')
const panel = require("../modules/store/panel/router")

//store_post
const store_advertisement = require("../modules/store/advertisement/router")
const store_auth = require("../modules/store/auth/router")
const storeStory = require("../modules/store/story/router")
const store_payment = require("../modules/store/payment/router")
const store_images = require("../modules/store/img/router")

//store_get
router.get(`/store/store`, middleware.authJwt, store_home.store)
router.get(`/store/register`, store_auth.get_register)
router.get(`/store/login`, store_auth.get_login)
router.get(`/store/sectors`,middleware.authJwt, sectorSearch.get_sectors)
router.get(`/store/search_sector`,middleware.authJwt, sectorSearch.get_search_sector)
router.get(`/store/logout`,middleware.authJwt,store_auth.logout)
router.get(`/store/products`,middleware.authJwt,products.all_products)
router.get(`/store/product/:id`,middleware.idChecker(),middleware.authJwt,products.single_product)
router.get(`/store/advertisements`, middleware.authJwt, all_advertisement.all_advertisement)
router.get(`/store/advertisement/:id`,middleware.idChecker(), middleware.authJwt, all_advertisement.single_advertisement)
router.get(`/store/images`,middleware.authJwt,store_images.get_images)
router.get(`/store/panel`,middleware.authJwt,panel.get_info)
router.get(`/store/panel/:id`,middleware.idChecker(),middleware.authJwt,panel.show_info)
router.get(`/store/payments`, middleware.authJwt,store_payment.all_payment)
router.get(`/store/payment/:id`,middleware.idChecker(), middleware.authJwt, store_payment.single_payment)
router.get(`/store/payment_cancel/:id`,middleware.idChecker(),middleware.authJwt,store_payment.cancel_payment)
router.get(`/store/stories`,middleware.authJwt ,storeStory.all_story)
router.get(`/store/home_page`,middleware.authJwt ,store_home.home_page)

//store_post
router.post(`/store/register`,uploadImage.single("img"),store_auth.register)
router.post(`/store/login`,store_auth.login)
router.post(`/store/forgot_password`,middleware.authJwt,store_auth.forgot_password)
router.post(`/store/reset_password`,middleware.authJwt,store_auth.reset_password)
router.put(`/store/update_password`,middleware.authJwt,store_auth.update_password)
router.post(`/store/advertisement`, middleware.authJwt ,middleware.ip_mid.ip2_Middleware,uploadImage.array("img"),store_advertisement.add_advertisement)
router.delete(`/store/advertisement/:id`,middleware.idChecker(), middleware.authJwt, all_advertisement.delete_advertisement);
router.post(`/store/products`, middleware.authJwt, uploadImage.array('img',10),products.add_products)
router.delete(`/store/product/:id`,middleware.idChecker(), middleware.authJwt, products.delete_product)
router.put(`/store/product/:id`,middleware.idChecker(), middleware.authJwt, products.update_product)
router.put(`/store/panel`,middleware.authJwt,panel.update_info);
router.post(`/store/payment`,middleware.authJwt,middleware.ip_mid.ip2_Middleware,store_payment.store_date_payment)
router.post(`/store/storie`,middleware.authJwt, uploadImage.array("img",5),storeStory.add_story)
router.delete(`/store/storie/:id`,middleware.idChecker(),middleware.authJwt,storeStory.delete_story);
router.post(`/store/images`,middleware.authJwt,uploadImage.array("url"),store_images.add_images);
router.delete(`/store/images`,middleware.authJwt,store_images.delete_images);

module.exports = router;    
