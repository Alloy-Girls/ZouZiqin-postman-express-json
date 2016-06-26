var express = require('express');
var bodyParser = require('body-parser');
var productsManager = require('./products-manager');

var router = express.Router();
router.use(bodyParser.json());

router.post('/',function(req,res){
  var addData = req.body;
  if (!productsManager.isTrueDataProterty(addData)) {
    res.sendStatus(401);
  }
  if (!productsManager.isTrueDataType(addData)) {
    res.sendStatus(401);
  }else {
    res.status(201).json(productsManager.save(addData));
  }
});

router.get('/:id',function(req,res,next){
  var found = productsManager.getOne(req.params.id);
  if (found) {
    res.status(200).json(found);
  } else {
    res.sendStatus(404);
  }
});

router.get('/',function(req,res){
  res.json(productsManager.getAll());
});

router.put('/:id',function(req,res,next){
  var updateData = req.body;
  if (!productsManager.isTrueDataProterty(updateData)) {
    res.sendStatus(401);
  }
  if (!productsManager.isTrueDataType(updateData)) {
    res.sendStatus(401);
 }else {
   var updated = productsManager.update(req.params.id,updateData);
   if (updated) {
     res.status(201).json(updated);
   }else {
     res.sendStatus(404);
   }
 }
});

router.delete('/:id',function(req,res){
  var result = productsManager.remove(req.params.id);
  if (result) {
    res.sendStatus(201);
  }else {
    res.sendStatus(404);
  }
});

module.exports = router;
