angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})
.factory('Entries',function($q,$http){
    var storage;
    if(window.localStorage !== null) {
        storage = window.localStorage;
    } else {
        storage = {};
    }

    var entrylist = storage["entries"];
    if(typeof(entrylist) === 'undefined' || entrylist === null || entrylist === "") {
        storage["entries"] = "[]";
        entrylist = [];
    } else {
        entrylist = JSON.parse(entrylist);
    }

    var i=0,entries=[],entry;

    for(i=0;i<entrylist.length;i++){
        entry= localStorage["entry." + entrylist[i]];
        if(typeof(entry) === 'undefined' || entry === null)
            continue;
        entries.push(JSON.parse(entry));
    }

  return {
    all: function(){
        //console.log(entrylist,entries);
      return entries;
    },
    removeAt: function(index){
        entrylist.splice(index,1);
        storage["entries"] = JSON.stringify(entrylist);
        entries.splice(index,1);
    },
    refresh: function(){
        return $http.get("/api/entry/query/"+entrylist.join(","))
                    .then(function(res){
                        var ret = res.data;
                        var i,e;
                        for(i in ret.data) {
                            e = ret.data[i];
                        }
                    })
    },
    reorder: function(fromIndex, toIndex){
        var e = entries.splice(fromIndex,1);
        entries.splice(toIndex,0,e[0]);
        e = entrylist.splice(fromIndex,1);
        entrylist.splice(toIndex,0,e[0]);
        storage["entries"] = JSON.stringify(entrylist);
    },
    add: function(id){
        return $q(function(resolve,reject){
            $http.get("/api/entry/query/"+id).then(function(res){
                console.log(res);
            var ret = res.data;
            var i,d,e;
            if(ret.code == '200'){ // found 
                for(i in ret.data){
                    d = ret.data[i];
                    e = {
                        id: i,
                        status: d.status,
                        message: d.message,
                        declare_date: d.declare_date,
                        trade_name: d.trade_name
                    };
                    entries.push(e);
                    entrylist.push(i);
                    storage["entry."+i] = JSON.stringify(e);
                }
                storage["entries"] = JSON.stringify(entrylist);
                resolve(e);
            }
            else if (ret.code == '404') { // not found
                reject({message:"没有此报关单信息"});
            }
            else {
                reject({message: ret.status});
            }
        },function(err){
            reject({message:"无法联系服务器"});
            console.log(err);
        })});
    }
  }
});
