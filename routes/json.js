var fs = require('fs');
//判断文件是否存在，若不存在新建文件
fs.exists('./data.json', function (exists) {
  if (!exists) {
    fs.open('./data.json', 'a', function (err, fd) {
      if (err) {
        console.log("创建文件失败");
      }
    });
    fs.writeFile('./data.json','[]',function(err){});
  }
});

//设置初始化id为0
var id = 0;

var insert = function(req,res){
  var products = [];
  var addData = req.body;
  if (!isTrueDataProterty(addData)) {
    res.send("401 输入数据缺失属性");
  }
  if (!isTrueDataType(addData)) {
    res.send("400 输入的数据类型错误");
  }
  var data = {
    "barcode": addData.barcode,
    "name": addData.name,
    "unit": addData.unit,
    "price": addData.price
  };
  fs.readFile('./data.json', 'utf8', function(err, result){
    products = JSON.parse(result);
    if (products.length !== 0){
      id = products.length;
    }
    else {
      id = 0;
    }
    data.id = id;
    id = id + 1;
    products.push(data);
    fs.writeFile('./data.json', JSON.stringify(products), function(err){
      if(err){
        res.send("505 添加数据出错");
      }
    });
    res.status(201).json(data);
  });
};

var findOne = function(req,res){
  var products = [];
  var data_id = parseInt(req.params.id);
  fs.readFile('./data.json', 'utf8', function(err, result){
    products = JSON.parse(result);
    var item = getItem(data_id,products);
    if (item) {
      res.status(200).json(item);
    }
    else {
      res.send("404 没有此商品");
    }
  });
};

var getItem = function(id,products){
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      return products[i];
    }
  }
};

var find = function(req,res){
  var products = [];
  fs.readFile('./data.json', 'utf8', function(err, result){
    products = JSON.parse(result);
    res.status(200).json(products);
  });
};

var update = function(req,res){
  var products = [];
  var data_id = parseInt(req.params.id);
  var updateData = req.body;
  if (!isTrueDataType(updateData)) {
    res.send("400 输入的数据类型错误");
  }
  var data = {
    "barcode": updateData.barcode,
    "name": updateData.name,
    "unit": updateData.unit,
    "price": updateData.price
  };
  fs.readFile('./data.json', 'utf8', function(err, result){
    products = JSON.parse(result);
    var item = updateProduct(data_id,data,products);
    if (!item) {
      res.send("404 没有此商品");
    }
    fs.writeFile('./data.json',JSON.stringify(products), function(err){
      if(err){
        res.send("505 修改数据出错");
      }
    });
    res.status(200).json(item);
  });
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

var remove = function(req,res){
  var products = [];
  var data_id = parseInt(req.params.id);
  fs.readFile('./data.json', 'utf8', function(err, result){
    products = JSON.parse(result);
    var isTure = removeProduct(data_id,products);
    if (!isTure) {
      res.send("404 没有此商品");
    }
    fs.writeFile('./data.json',JSON.stringify(products), function(err){
      if(err){
        res.send("505 删除数据出错");
      }
    });
    res.send("204 删除成功");
  });
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

exports.insert = insert;
exports.findOne = findOne;
exports.find = find;
exports.update = update;
exports.remove = remove;
