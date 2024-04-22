
var db=require('../config/connection')
var collection=require('../config/collections')
const bcrypt=require('bcrypt')
const { log } = require('handlebars')
const { ObjectId } = require('mongodb')
const Razorpay = require('razorpay');
const { response } = require('../app')
const { resolve } = require('path')
var objectId=require('mongodb').ObjectId
var instance = new Razorpay({
    key_id: 'rzp_test_6UsdoE7iTs66c8',
    key_secret: 'qdtAVjaHJZY1cpzAlinUbled',
  });


module.exports={

    generateRazorpay: (orderId, total) => {
        return new Promise((resolve, reject) => {
            var options = {
                amount: total*100,
                currency: "INR",
                receipt: ""+orderId 
            };
            instance.orders.create(options, function(err, order) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("NEW ORDER:", order);
                    resolve(order);
                }
            });
        });
    },
    
    verifyPayment: (details) => {
        return new Promise((resolve, reject) => {
            const crypto = require('crypto');
            let hmac = crypto.createHmac('sha256', 'qdtAVjaHJZY1cpzAlinUbled');
            hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]']);
            hmac = hmac.digest('hex');
            if (hmac == details['payment[razorpay_signature]']) {
                resolve();
            } else {
                reject();
            }
        });
    },
    

  changePaymentStatus:(orderId)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.ORDER_COLLECTION)
        .updateOne({_id:objectId(orderId)},
        {
            $set:{
                status:'placed'
            }
        }
        ) .then(()=>{
            resolve()
        })
    })
  }
}