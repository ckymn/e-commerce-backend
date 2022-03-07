module.exports = {
  apps: [
    {
      name: 'vitrinint-api',
      script: 'npm start',
      instances: 1,
      watch: true,
      env: {
        JWT_ACCESS_SECRET:'8084cd4c7d6a11cd02e13e4fe153bf9c285e580f27f118b2136200d56f85cf06522e42442b5d0895b3b2a42f5936d76a4b9b0a5$',
        JWT_ACCESS_TIME:'24h',
        MY_PLAIN_TEXT_PASSWORD:'vitrin_my_plain_text',
        PORT:5001,
        MONGO_URI:'mongodb+srv://vitrin:Vitrin123@vitrin0.pv3ar.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
        HOST:'smtp.gmail.com',
        USER_EMAIL:'vitrininternational@gmail.com',
        USER_PASSWORD:'1974.HulyaOzkoc',
        SERVICE:'gmail',
        BUCKET_STORES:'vitrin_stores',
        BUCKET_ADMINS:'vitrin_admins',
        BUCKET_IMAGES:'vitrin_images',
        BUCKET_STORE_ADS:'vitrin_store_ads',
        BUCKET_ADMIN_ADS:'vitrin_admin_ads',
        BUCKET_SUBSCRIPTIONS:'vitrin_subscriptions',
        BUCKET_ADMIN_BANNERS:'vitrin_admin_banner',
        BUCKET_ADMIN_STORYS:'vitrin_admin_storys',
        BUCKET_STORE_STORYS:'vitrin_store_storys'
      }
    }
  ]
};
