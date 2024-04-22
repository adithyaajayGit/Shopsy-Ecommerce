var db=require('../config/connection')
var collection=require('../config/collections')
const bcrypt=require('bcrypt')
const { log } = require('handlebars')
const { ObjectId } = require('mongodb')
const Razorpay = require('razorpay');
const { response } = require('../app')
var objectId=require('mongodb').ObjectId
var instance = new Razorpay({
    key_id: 'rzp_test_6UsdoE7iTs66c8',
    key_secret: 'qdtAVjaHJZY1cpzAlinUbled',
  });


module.exports={

    generateRazorpay: (orderId, total) => {
        return new Promise((resolve, reject) => {
            var options = {
                amount: total,
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
    
  
}