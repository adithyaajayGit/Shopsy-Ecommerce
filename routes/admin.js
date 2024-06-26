var express = require('express');
var router = express.Router();
var productHelper=require('../helpers/product-helpers');
const productHelpers = require('../helpers/product-helpers');
const { response } = require('../app');
const { route } = require('./admin');
 // Make sure to include a semicolon at the end of this line
 const verifyLogin=(req,res,next)=>{
  if(req.session.admin.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}


/* GET users listing. */
router.get('/', function(req, res, next) {
 productHelpers.getAllProducts().then((products)=>{
  res.render('admin/view-products',{admin:true,products});
 });
});
router.get('/add-product',function(req,res){
      res.render('admin/add-product');
});


router.post('/add-product',(req,res)=>{


  productHelpers.addProduct(req.body,(id)=>{
    let image=req.files.Image;
    console.log(id);
    image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
      if(!err){
        res.redirect('/admin/');
      }else{
        console.log(err);
      }
    });
  });
});
router.get('/delete-product/',(req,res)=>{
    let proId=req.query.id;
    console.log(proId);
    productHelpers.deleteProduct(proId).then((response)=>{
      res.redirect('/admin/');
    });
});

router.get('/edit-product/:id',async(req,res)=>{
  let product= await productHelpers.getProductDetails(req.params.id);
  console.log(product);
  res.render('admin/edit-product',{product});
});

router.post('/edit-product/:id', (req, res) => {
  console.log(req.params.id);
  let id = req.params.id;
  
  // Check if any files were uploaded
  if (req.files && req.files.Image) {
    let image = req.files.Image;
    
    // Update the product with the new details
    productHelpers.updateProduct(req.params.id, req.body).then(() => {
      // Move the uploaded image to the appropriate directory
      image.mv('./public/product-images/' + id + '.jpg', (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Image uploaded successfully');
        }
      });
    });
  } else {
    // If no image was uploaded, simply update the product details
    productHelpers.updateProduct(req.params.id, req.body).then(() => {
      console.log('Product details updated successfully');
    });
  }
  
  // Redirect to the admin page
  res.redirect('/admin');
});
router.get('/adminorders',async(req,res)=>{
  let orders=await productHelpers.getOrders()
  res.render('admin/adminorders',{admin:true,orders})
})

router.get('/view-order-products/:id',async(req,res)=>{
  let products=await productHelpers.getOrderProducts(req.params.id)
  res.render('admin/view-order-products',{admin:true,products})
})

router.get('/login',(req,res)=>{
  if(req.session.admin){

    res.redirect('/admin/')
  }
    else{
    res.render('admin/login',{"loginErr":req.session.adminLoginErr})
    req.session.adminLoginErr=false;
    }
})

router.get('/signup',(req,res)=>{
  res.render('admin/signup')
})

router.post('/signup',(req,res)=>{
  productHelpers.doSignup(req.body).then((response)=>{
    console.log(response);
    req.session.admin=response
    req.session.admin.loggedIn=true
    res.redirect('/admin/')
  })
})

router.post('/login',(req,res)=>{
  productHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.admin=response.admin
      req.session.admin.loggedIn=true
      res.redirect('/admin/')
    }else{
      req.session.adminLoginErr="invalid username or password"
      res.redirect('admin/login')
    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.admin=null;
  req.session.adminloggedIn=false;
  res.redirect('/')
})


module.exports = router;
