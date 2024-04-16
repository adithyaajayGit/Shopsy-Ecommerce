var db=require('../config/connection')
var collection=require('../config/collections')
const bcrypt=require('bcrypt')
const { log } = require('handlebars')
const { ObjectId } = require('mongodb')
const { response } = require('../app')
var objectId=require('mongodb').ObjectId

module.exports={
    doSignup:(userData)=>{
            return new Promise(async(resolve,reject)=>{
                userData.Password= await bcrypt.hash(userData.Password,10)
                db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                    resolve(data.insertedId)
                })
            })      
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let response={}
                let user=await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
                if(user){
                    bcrypt.compare(userData.Password,user.Password).then((status)=>{
                        if(status){
                            console.log("login success");
                            response.user=user
                            response.status=true
                            resolve(response)
                        }else{
                            console.log("login failed");
                            resolve({status:false})
                        }
                    })
                }else{
                    console.log("login failed")
                    resolve({status:false})
                }
        })
    },

    addToCart:(proId,userId)=>{
        return new Promise(async(resolve,reject)=>{
            let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectId(userId)})
            if(userCart){
                    db.get().collection(collection.CART_COLLECTION)
                    .updateOne({user:objectId(userId)},
                    {
                            $push:{products:objectId(proId)}
                    }
                    
                ).then((response)=>{
                    resolve()
                })
            }else{
                let cartobj={
                    user:objectId(userId),
                    products:[objectId(proId)]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartobj).then((response)=>{
                    resolve()
                })
            }
        })
    },

    getCartProducts: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                    {
                        $match: { user: objectId(userId) }
                    },
                    {
                        $lookup: {
                            from: collection.PRODUCT_COLLECTION, // Assuming this is the correct collection name for products
                            let: { prodList: '$products' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $in: ['$_id', "$$prodList"]
                                        }
                                    }
                                }
                            ],
                            as: 'cartItems'
                        }
                    }
                ]).toArray();
                
                if (cartItems.length > 0) {
                    resolve(cartItems[0].cartItems);
                } else {
                    resolve([]); // If no cart items found, resolve with an empty array
                }
            } catch (error) {
                console.error("Error in getCartProducts:", error);
                reject(error);
            }
        });
    }
    
}