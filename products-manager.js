var fs = require('fs');
var nextId = require('./next-id');
var _ = require('lodash');

var FILE_NAME = 'data.json';

fs.exists(FILE_NAME, function (exists) {
  if (!exists) {
    fs.open(FILE_NAME, 'a', function (err, fd) {
      if (err) {
        console.log("创建文件失败");
      }
    });
    fs.writeFile(FILE_NAME,'[]',function(err){});
  }
});

var save = function(addData){
  var data = {
    "id": nextId(),
    "barcode": addData.barcode,
    "name": addData.name,
    "unit": addData.unit,
    "price": addData.price
  };
  var products = JSON.parse(fs.readFileSync(FILE_NAME));
  products.push(data);
  fs.writeFile(FILE_NAME, JSON.stringify(products), function(err){});
  return data;
};

var getOne = function(id){
  var products = JSON.parse(fs.readFileSync(FILE_NAME));
  var item =  _.find(products, ['id' , parseInt(id)]);
  if (item) {
    return item;
  }
};

var getAll = function(){
  return JSON.parse(fs.readFileSync(FILE_NAME));
};

var update = function(id,updateData){
  var data = {
    "barcode": updateData.barcode,
    "name": updateData.name,
    "unit": updateData.unit,
    "price": updateData.price
  };
  var products = JSON.parse(fs.readFileSync(FILE_NAME));
  var item = updateProduct(parseInt(id),data,products);
  if (item) {
    fs.writeFile(FILE_NAME,JSON.stringify(products), function(err){});
    return item;
  }
};

var updateProduct = function(id,data,products){
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      products[i].barcode = data.barcode;
      products[i].name = data.name;
      products[i].price = data.price;
      products[i].unit = data.unit;
      return products[i];
    }
  }
};

var remove = function(id){
  var products = JSON.parse(fs.readFileSync(FILE_NAME));
  var isTure = removeProduct(parseInt(id),products);
  if (isTure) {
    fs.writeFile(FILE_NAME,JSON.stringify(products), function(err){});
    return true;
  }
};

var removeProduct = function(id,products){
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      products.splice(i,1);
      return true;
    }
  }
};

var isTrueDataProterty = function(collection){
  if (collection.barcode && collection.name && collection.unit && collection.price) {
    return true;
  }
};

var isTrueDataType = function(collection){
  if (isString(collection.barcode) && isString(collection.name) && isString(collection.unit) && isNumber(collection.price)) {
    return true;
  }
};

var isString = function(data){
  if (typeof(data) === 'string') {
    return true;
  }
};

var isNumber = function(data){
  if (typeof(data) === 'number') {
    return true;
  }
};

module.exports = {
  save : save,
  getOne : getOne,
  getAll : getAll,
  update : update,
  remove : remove,
  isTrueDataProterty : isTrueDataProterty,
  isTrueDataType : isTrueDataType
};
