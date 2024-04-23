var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const razorpayHelper = require('../helpers/razorpay-helper')
const userHelpers=require('../helpers/user-helpers');
const { response } = require('../app');
const { route } = require('./admin');
const verifyLogin=(req,res,next)=>{
  if(req.session.user.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', async function(req, res, next) {
  let user=req.session.user
  console.log(user);
  let cartCount=null;
  if(req.session.user){
    cartCount=await userHelpers.getCartCount(req.session.user._id)
  }
  productHelpers.getAllProducts().then((products)=>{
    res.render('user/view-products',{admin:false,products,user,cartCount})
   })
});

router.get('/login',(req,res)=>{
  if(req.session.user){

    res.redirect('/')
  }
    else{
    res.render('user/login',{"loginErr":req.session.userLoginErr})
    req.session.userLoginErr=false;
    }
})

router.get('/signup',(req,res)=>{
  res.render('user/signup')
})

router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    console.log(response);
    req.session.user=response
    req.session.user.loggedIn=true
    res.redirect('/')
  })
})

router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.user=response.user
      req.session.user.loggedIn=true
      res.redirect('/')
    }else{
      req.session.userLoginErr="invalid username or password"
      res.redirect('/login')
    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.user=null
  res.redirect('/')
})
router.get( '/cart', verifyLogin,async(req,res)=>{
  let products=await userHelpers.getCartProducts(req.session.user._id)
  let totalValue=0;
  if(products.length>0){  
    totalValue=await userHelpers.getTotalAmount(req.session.user._id)
  }
  console.log(products)
  res.render('user/cart',{products,user:req.session.user,totalValue})
})

router.get('/add-to-cart/:id', (req,res)=>{
  console.log("api call")

  userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
    res.json({status:true})
  })

})

router.post('/change-product-quantity',(req,res,next)=>{
 userHelpers.changeProductQuantity(req.body).then(async(response)=>{
  response.total=await userHelpers.getTotalAmount(req.body.user)
  res.json(response)
 })
})


router.post('/remove-product',(req,res)=>{
  let cartId = req.body.cartId; // Assuming you're passing the cart ID
  let productId = req.body.productId;

  userHelpers.removeProductFromCart(cartId,productId).then((response)=>{
    res.json(response);
  })
})


router.get('/place-order',verifyLogin,async(req,res)=>{
  let total=await userHelpers.getTotalAmount(req.session.user._id)
  res.render('user/place-order',{total,user:req.session.user})
})

router.post('/place-order', async (req, res) => {
  let products = await userHelpers.getCartProductList(req.body.userId);
  let totalPrice = await userHelpers.getTotalAmount(req.body.userId);
  
  userHelpers.placeOrder(req.body, products, totalPrice).then((orderId) => {
      if (req.body['payment-method'] === 'COD') {
          res.json({ codSuccess: true });
      } else {
          razorpayHelper.generateRazorpay(orderId, totalPrice).then((response) => {
              res.json(response);
          });
      }
  }).catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
  });
});


router.get('/order-confirm',verifyLogin,(req,res)=>{
  res.render('user/order-confirm',{user:req.session.user})
})

router.get('/orders',async(req,res)=>{
  let orders=await userHelpers.getUserOrders(req.session.user._id)
  res.render('user/orders',{user:req.session.user,orders})
})

router.get('/view-order-products/:id',async(req,res)=>{
  let products=await userHelpers.getOrderProducts(req.params.id)
  res.render('user/view-order-products',{user:req.session.user,products})
})

router.post('/verify-payment',(req,res)=>{
  console.log(req.body)
  razorpayHelper.verifyPayment(req.body).then(()=>{
    razorpayHelper.changePaymentStatus(req.body['order[receipt]']).then(()=>{
      console.log("payment successfull")
      res.json({status:true})
    })
  }).catch((err)=>{
    console.log(err);
    res.json({status:false,errMsg:''})
  })
})
module.exports = router;
