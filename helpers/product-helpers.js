
var db=require('../config/connection')
var collection=require('../config/collections')
const { ObjectId } = require('mongodb')
var objectId=require('mongodb').ObjectId
const bcrypt=require('bcrypt')


module.exports={
    addProduct:(product,callback)=>{
        db.get().collection('product').insertOne(product).then((data)=>{
            callback(data.insertedId)
        })
    },

    getAllProducts:()=>{
        return new Promise(async (resolve,reject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
    deleteProduct:(prodId)=>{
           return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:objectId(prodId)}).then((response)=>{
                resolve(response)
            })
           }) 
    },

    getProductDetails:(proId)=>{
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectId(proId)}).then((product)=>{
                    resolve(product)
                })
            })
    },

    updateProduct:(proId,proDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION)
            .updateOne({_id:objectId(proId)},{
                $set:{
                    productName:proDetails.productName,
                    description:proDetails.description,
                    price:proDetails.price,
                    category:proDetails.category,
                }
            }).then((response)=>{
                resolve()
            })
        })
    },


    getOrders: () => {
        return new Promise(async (resolve, reject) => {
          try {
            // Fetch orders from the order collection
            let orders = await db.get().collection(collection.ORDER_COLLECTION).find().toArray();
      
            // Fetch user details for each order based on user ID
            for (let order of orders) {
              // Fetch user details from the user collection using the user ID associated with the order
              let user = await db.get().collection(collection.USER_COLLECTION).findOne({_id: order.userId});
              // Add the user's email to the order object
              order.userEmail = user.Email; // Accessing the 'Email' field of the user object
            }
      
            resolve(orders);
          } catch (error) {
            console.error('Error fetching orders:', error);
            reject(error);
          }
        });
      },


      getOrderProducts: (orderId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let orderItems = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                    {
                        $match: { _id: objectId(orderId) }
                    },
                    {
                        $unwind: '$products'
                    },
                    {
                        $lookup: {
                            from: collection.PRODUCT_COLLECTION,
                            localField: 'products.item',
                            foreignField: '_id',
                            as: 'product'
                        }
                    },
                    {
                        $project: {
                            item: '$product._id',
                            productName: '$product.productName',
                            description: '$product.description',
                            price: '$product.price',
                            quantity: '$products.quantity'
                        }
                    }
                ]).toArray();
    
                if (orderItems.length > 0) {
                    resolve(orderItems);
                } else {
                    resolve([]); // If no items found, resolve with an empty array
                }
            } catch (error) {
                console.error("Error in getOrderProducts:", error);
                reject(error);
            }
        });
    },
    doSignup:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            adminData.Password= await bcrypt.hash(adminData.Password,10)
            db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData).then((data)=>{
                resolve(data.insertedId)
            })
        })      
},
doLogin:(adminData)=>{
    return new Promise(async(resolve,reject)=>{
        let loginStatus=false
        let response={}
            let admin=await db.get().collection(collection.ADMIN_COLLECTION).findOne({Email:adminData.Email})
            if(admin){
                bcrypt.compare(adminData.Password,admin.Password).then((status)=>{
                    if(status){
                        console.log("login success");
                        response.admin=admin
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
      
      
}