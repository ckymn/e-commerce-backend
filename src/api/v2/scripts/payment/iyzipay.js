const Iyzipay = require("iyzipay")

const iyzipay = new Iyzipay({
    apiKey: 'sandbox-7fyLYoNvN7cNmIxMfpnLLHjM9SxqWhsM',
    secretKey: 'sandbox-ytP3ebMCBRWKr8RUg9Z8YzAY6uSN1ESH',
    uri: 'https://sandbox-api.iyzipay.com'
})

// odeme form
const pay_form_ads = async(
    basket_id,card_price,card_paid_price,card_installment,card_holder_name,
    card_number,card_expire_month,card_expire_year,card_cvc,card_register,
    buyerId,buyerName,buyerSurname,buyerNumber,buyerEmail,tcNo,buyerAddress,
    buyerIp,buyerCity,buyerCountry,ship_b_name,ship_b_city,ship_b_country,
    ship_b_address,items) => {
    let request =  {
        locale: Iyzipay.LOCALE.TR,
        conversationId: buyerId,
        price: card_price,
        paidPrice: card_paid_price,
        currency: Iyzipay.CURRENCY.TRY,
        installment:card_installment,
        basketId: basket_id,
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        paymentCard: {
            cardHolderName: card_holder_name,
            cardNumber: card_number,
            expireMonth: card_expire_month,
            expireYear: card_expire_year,
            cvc: card_cvc,
            registerCard: card_register
        },
        buyer: {
            id: buyerId,
            ip: "192.168.1.37",
            name: buyerName,
            surname: buyerSurname,
            gsmNumber: buyerNumber,
            email: buyerEmail,
            identityNumber: tcNo,
            registrationAddress: buyerAddress,
            city: buyerCity,
            country: buyerCountry,
        },
        // shippingAddress: {
        //     contactName: ship_name,
        //     city: ship_city,
        //     country: ship_country,
        //     address: ship_address,
        //     zipCode: zipCode
        // },
        billingAddress: {
            contactName: ship_b_name,
            city: ship_b_city,
            country: ship_b_country,
            address: ship_b_address,
        },
        basketItems: [{
            id: basket_id,
            name: items.name,
            category1: items.category1,
            price: items.price,
            itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
        }]
    }
    return request
}

const pay_form = async(
    basket_id,card_price,card_paid_price,card_installment,card_holder_name,
    card_number,card_expire_month,card_expire_year,card_cvc,card_register,
    buyerId,buyerName,buyerSurname,buyerNumber,buyerEmail,tcNo,buyerAddress,
    buyerIp,buyerCity,buyerCountry,ship_name,ship_city,ship_country,
    ship_address,ship_b_name,ship_b_city,ship_b_country,ship_b_address,items ) => {
    let request =  {
        locale: Iyzipay.LOCALE.TR,
        conversationId: buyerId,
        price: card_price,
        paidPrice: card_paid_price,
        currency: Iyzipay.CURRENCY.TRY,
        installment:card_installment,
        basketId: basket_id,
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        paymentCard: {
            cardHolderName: card_holder_name,
            cardNumber: card_number,
            expireMonth: card_expire_month,
            expireYear: card_expire_year,
            cvc: card_cvc,
            registerCard: card_register
        },
        buyer: {
            id: buyerId,
            name: buyerName,
            surname: buyerSurname,
            gsmNumber: buyerNumber,
            email: buyerEmail,
            identityNumber: tcNo,
            registrationAddress: buyerAddress,
            ip: "192.168.1.37",
            city: buyerCity,
            country: buyerCountry,
        },
        shippingAddress: {
            contactName: ship_name,
            city: ship_city,
            country: ship_country,
            address: ship_address,
        },
        billingAddress: {
            contactName: ship_b_name,
            city: ship_b_city,
            country: ship_b_country,
            address: ship_b_address,
        },
        basketItems: [{
            id: basket_id,
            name: items.name,
            category1: items.category1,
            itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
            price: items.price
        }]
    }
    return request;
}

module.exports = {
    iyzipay,
    pay_form,
    pay_form_ads,
    Iyzipay
}