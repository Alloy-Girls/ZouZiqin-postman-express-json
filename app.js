var express = require('express');
var app = express();
app.use(express.static('./views')).listen(3000);
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // 解析 application/json 类型数据
console.log('imooc started on port 3000');

var control = require('./routes/json.js');

app.post('/products',control.insert);
app.get('/products/:id',control.findOne);
app.get('/products',control.find);
app.put('/products/:id',control.update);
app.delete('/products/:id',control.remove);
