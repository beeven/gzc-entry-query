var express = require("express"),
    app = express();


app.use(express.static(__dirname+"/www"));

app.get("/EntryQuery/api/entry/query/:ids",function(req,res){
    var ids = req.params.ids;
   if(/[^\d,]+/.test(ids)){
       res.json({code:300,status:"Illegal character detected in id."});
       return;
   }

   console.log("Date: %s, Id: %s",new Date(),ids);

   var idArray = ids.split(",").filter(function(e){return e});

   var ret = {}
   var i=0,id;
   for(i=0;i<idArray.length;i++){

       id = idArray[i];
       if(id == 1){
           res.json({code:"200",count:0,data:{}});
           console.log("count:0, data:{}");
           return;
       }
       ret[id] = {
               "trade_name":"福建奋安铝业有限公司",
               "status":"审核结束",
               "message":"通关无纸化审结",
               "declare_date":"2015-06-24T14:19:51.000Z"}
       }
    res.json({code:"200",count:i, data:ret});
    console.log("count: %d, data:%s",i, ret);
});


app.listen(8000);
