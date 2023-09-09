var express = require('express');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
const userHelpers = require('../helpers/user-helpers');
const { USER_COLLECTION } = require('../config/collections');

const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}


/* GET home page. */
router.get('/', async function(req, res, next) {
  let user=req.session.user


  let cartCount=null
  if(req.session.user){
let cartCount= await userHelpers.getCartCount(req.session.user._id)   // COUNT
  }
  // let products=[
  //   {
  //     name:"Iphone 11",
  //     Category:"mobile",
  //     Description:"This is a good phone",
  //     image:"https://images.samsung.com/is/image/samsung/p6pim/in/sm-e146bzghins/gallery/in-galaxy-f-sm-e146bzghins-sm-e---bzggins-536047036?$1300_1038_PNG$"
  //   },
  //   {
  //   name:"pocco",
  //   Category:"mobile",
  //   Description:"not good phone",
  //    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkkWyJ3TeQ47R3dL4k5LEFXLynKm12q-I2DSEVAtPDOtobn7Hc3TbGL2_wNu5qBKUJHv0&usqp=CAU",
  //   },
  //   {
  //     name:"iqooo",
  //     Category:"phone",
  //     Description:"better phone",
  //    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkkWyJ3TeQ47R3dL4k5LEFXLynKm12q-I2DSEVAtPDOtobn7Hc3TbGL2_wNu5qBKUJHv0&usqp=CAU",
  //   },
  //   {
  //     name:"redmin",
  //     Category:"phone",
  //     Description:"indians no one phone brand",
  //     image:"https://5.imimg.com/data5/SELLER/Default/2021/12/SR/BW/WT/25006117/oppo-mobiles-phones.jpeg",
  //   }

  // ]

  productHelpers.getAllProducts().then((products)=>{
    console.log(products)
    res.render('user/userview-products',{products,user,cartCount})
  })

});

router.get('/login',(req,res)=>{


  if(req.session.loggedIn){
    res.redirect('/')
  }else{

    res.render('user/login',{"loginErr":req.session.loginErr})
    req.session.loginErr=false
  }
  })
  

router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      
req.session.loggedIn=true
req.session.user=response.user

      res.redirect('/')
    }else{

      req.session.loginErr="invalid error or password"

      res.redirect('/login')
    }
  })
})


router.get('/signup',(req,res)=>{
 res.render('user/signup')
})

router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    console.log(req.body);
    console.log(response);
    req.session.loggedIn=true
    req.session.user.response
   res.render('/')
})
  })

  router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/')
  })

  router.get('/cart',verifyLogin,async(req,res)=>{
    let products= await userHelpers.getCartproducts(req.session.user._id)
    console.log(products);
   res.render('user/cart',{products,user:req.session.user})
  })
 

  router.get('/add-tocart/:id',(req,res)=>{
    console.log('api call')
    userHelpers.addTocart(req.params.id,req.session.user._id).then(()=>{
      res.json({status:true})
    })
  })
  



  // router.get('/cart',verifyLogin,async(req,res)=>{
    
  //   let products=await userHelpers.getCartproducts(req.session.user._id)
  //   console.log(products);
 
  //      res.render('user/cart',{products,user:req.session.user})
  //    })
 
 
  //    router.get('/add-to-cart/:id',(req,res)=>{
  //      console.log('api call');
  //      userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
  //       res.json({status:true})
  //      })
  //    })
 
 
 



module.exports = router;
