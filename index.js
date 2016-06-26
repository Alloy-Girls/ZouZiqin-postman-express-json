var express = require('express');
var app =  express();

app.use('/products',require('./products-router'));

var server = app.listen(3000,function(){
  console.log("Web server started on port " + server.address().port);
});
