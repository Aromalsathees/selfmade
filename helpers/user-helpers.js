var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
//const { response } = require('express')
//const { UPDATE } = require('mongodb/lib/bulk/common')
var objectId = require('mongodb').ObjectID


module.exports = {
  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {


      userData.Password = await bcrypt.hash(userData.Password, 10)
      db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
        resolve(data.insertedId)
      })
    })




  },
  doLogin: (userData) => {
    let loginStatus = false
    let response = {}
    return new Promise(async (resolve, reject) => {
      let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Emailaddress: userData.Emailaddress })
      if (user) {
        bcrypt.compare(userData.Password, user.Password).then((status) => {
          if (status) {
            console.log('login success');


            response.user = user
            response.status = true
            resolve(response)

          } else {
            console.log('login failed');
            resolve({ status: false })
          }
        })


      } else {
        console.log('doesnt exist')
        resolve({ status: false })
      }
    })
  },


 
 
 addTocart:(proId,userId)=>{
    let proObj={
        item:objectId(proId),
        quantity:1
    }

    return new Promise(async(resolve,reject)=>{
        let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
        if(userCart){
            let proExist=userCart.products.findIndex(product=> product.item==proId)
            console.log(proExist);
            if(proExist!=-1){
                db.get().collection(collection.CART_COLLECTION).updateOne({'products.item':(proId)},
                {
                  $inc:{'products.$.quantity':1}
                }
                ).then(()=>{
                    resolve()
                })
            }else{


        db.get().collection(collection.CART_COLLECTION).updateOne({user:objectId(userId)},
             {
            
                $push:{products:proObj  }


            
             }
        ).then((response)=>{
          resolve()
        })
    }



        }else{
            let cartObj={
                user:objectId(userId),
                products:[proObj]
            }
            db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                
                resolve()
            })

        }
    })
},
getCartproducts:(userId)=>{
    return new Promise(async(resolve,reject)=>{
      let cartItems=await db.get().collection(collection.CART_COLLECTION).aggregate([
        {
            $match:{user:objectId(userId)}
        },
        {
              $unwind:'$products'
            },
            {
              $project:{
                item:'$products.item',
                quantity:'$products.quantity'
              }
            },
            {
              $lookup:{
                from:collection.PRODUCT_COLLECTION,
                localField:'item',
                foreignField:'_id',
                as:'product'
              }
            }
            
        // {
        //     $lookup:{
        //         from:collections.PRODUCT_COLLECTION,
        //         let:{proList:'$products'},
        //         pipeline:[
        //             {
        //                $match:{
        //                  $expr:{
        //                     $in:['$_id',"$$proList"]
        //                  }
        //                }
        //             }
        //         ],
        //         as:'cartItems'
        //     }
        // }
      ]).toArray()
     // console.log(cartItems);
      resolve(cartItems)
    })
},
getCartCount:(userId)=>{
    return new Promise(async(resolve,reject)=>{{
        let count=0
        let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
        

        if(cart){
         count=cart.products.length
        }
        resolve(count)
    }})
}

}






//   addTocart: (proId, userId) => {
// let proObj={
//   item:objectId(proId),
//   quantity:1
// }

//     return new Promise(async (resolve, reject) => {
//       let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectId(userId) })
//       if (userCart) {
//         let proExist=userCart.products.findIndex(product=> product.item==proId)
//         console.log(proExist)
//         if(proExist!=-1){
//           db.get().collection(collection.CART_COLLECTION).updateOne({'products.item':objectId(proId) },
//           {
//             $inc:{'products.$.quantity':1}
//           }
//           ).then(()=>{
//             resolve()
//           })
//         }else{
//         db.get().collection(collection.CART_COLLECTION).updateOne({ user: objectId(userId) },
//           {

//             $push: { products: proObj }

//           }
//         ).then((response) => {
//           resolve()
//         })
          
//       }

//       }else{
//         let cartObj = {
//           user: objectId(userId),
//           products: [proObj]
//         }
//         db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response) => {
//           resolve()
//         })
//       }

//     })

//   },
//   getCartproducts:(userId)=>{
//     return new Promise(async(resolve,reject)=>{
//       let cartItems=await db.get().collection(collection.CART_COLLECTION).aggregate([
//         {
//             $match:{user:objectId(userId)}
//         },

//         // {
//         //   $unwind:'$products'
//         // },
//         // {
//         //   $project:{
//         //     item:'$products.item',
//         //     quantity:'$products.quantity'
//         //   }
//         // },
//         // {
//         //   $lookup:{
//         //     from:collection.PRODUCT_COLLECTION,
//         //     localField:'item',
//         //     foreignField:'_id',
//         //     as:'product'
//         //   }
//         // }
        
//         //
//       ]).toArray()
//       //console.log(cartItems[0].products);
//       resolve(cartItems);
//         })
//     },
  

//   getCartCount:(userId)=>{
//     return new Promise(async(resolve,reject)=>{{
//         let count=0
//         let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
        

//         if(cart){
//          count=cart.products.length
//         }
//         resolve(count)
//     }})
// }
// }


