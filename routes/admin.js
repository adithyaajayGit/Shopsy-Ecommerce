var express = require('express');
var router = express.Router();
var productHelper=require('../helpers/product-helpers');
const productHelpers = require('../helpers/product-helpers');
const { response } = require('../app');

/* GET users listing. */
router.get('/', function(req, res, next) {
 productHelpers.getAllProducts().then((products)=>{
  res.render('admin/view-products',{admin:true,products})
 })
});
router.get('/add-product',function(req,res){
      res.render('admin/add-product')
})


router.post('/add-product',(req,res)=>{


  productHelpers.addProduct(req.body,(id)=>{
    let image=req.files.Image
    console.log(id)
    image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
      if(!err){
        res.render("admin/add-product")
      }else{
        console.log(err);
      }
    })
  })
})
router.get('/delete-product/',(req,res)=>{
    let proId=req.query.id
    console.log(proId);
    productHelpers.deleteProduct(proId).then((response)=>{
      res.redirect('/admin/')
    })
})

router.get('/edit-product/:id',async(req,res)=>{
  let product= await productHelpers.getProductDetails(req.params.id)
  console.log(product);
  res.render('admin/edit-product',{product})
})

router.post('/edit-product/:id',(req,res)=>{
  console.log(req.params.id)
    productHelpers.updateProduct(req.params.id,req.body).then(()=>{
      res.redirect('/admin')
    })
})
module.exports = router;
