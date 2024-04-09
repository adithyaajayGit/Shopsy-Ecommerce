var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  let products=[
    {
      name:"Iphone 13",
      category:"mobile",
      description:"This is iphone 13",
      image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiLUUq55k27aO5PXkY7-OWWJ4Yz8HY_7EImrw-9EKDiQ&s"
    },
    {
      name:"Redmi note 13",
      category:"mobile",
      description:"This is Redmi note 13",
      image:"https://rukminim2.flixcart.com/image/850/1000/xif0q/mobile/s/y/5/-original-imagwu894yyhyyce.jpeg?q=90&crop=false-tbn0.gstatic.com/images?q=tbn:ANd9GcSiLUUq55k27aO5PXkY7-OWWJ4Yz8HY_7EImrw-9EKDiQ&s"
    },
    {
      name:"Oppo F17 pro",
      category:"mobile",
      description:"This is Oppo F17 pro",
      image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKeEXCbNMv6O-16mkkGLixn63G3UPq6gJwIAINInE3_Q&s.flixcart.com/image/850/1000/xif0q/mobile/s/y/5/-original-imagwu894yyhyyce.jpeg?q=90&crop=false-tbn0.gstatic.com/images?q=tbn:ANd9GcSiLUUq55k27aO5PXkY7-OWWJ4Yz8HY_7EImrw-9EKDiQ&s"
    },
    {
      name:"Samsung s23 ",
      category:"mobile",
      description:"This is samsung s23",
      image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSokioDkjsWb64K8UW4JS8OXMeniLdyZ6Wvx6sUQcDt8Q&s://https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKeEXCbNMv6O-16mkkGLixn63G3UPq6gJwIAINInE3_Q&s.flixcart.com/image/850/1000/xif0q/mobile/s/y/5/-original-imagwu894yyhyyce.jpeg?q=90&crop=false-tbn0.gstatic.com/images?q=tbn:ANd9GcSiLUUq55k27aO5PXkY7-OWWJ4Yz8HY_7EImrw-9EKDiQ&s"
    }
    
  ]
  res.render('admin/view-products',{admin:true,products})
});
router.get('/add-product',function(req,res){
      res.render('admin/add-product')
})
router.post('/add-product',(req,res)=>{
  console.log(req.body);
  console.log(req.files.image)
})
module.exports = router;
