var express = require("express"),
    app = express(),
    http = require("http");


app.use(express.static(__dirname+"/www"));

app.get("/api/entry/query/:ids",function(req,res){
    var ids = req.params.ids;
   if(/[^\d,]+/.test(ids)){
       res.json({code:300,status:"Illegal character detected in id."});
       return;
   }

   var request = http.get("http://10.53.1.181:3000/entry_pop/api/entry/" + ids,function(response){
     var data="";
     response.on('data',function(chunk){
       data += chunk;
     });
     response.on('end',function(){
       res.json(JSON.parse(data.toString()));
     })
   });
   request.on('error',function(err){
     res.status(500);
     console.log(err);
   });
});


app.listen(3003);
console.log("Listening on 3003");
