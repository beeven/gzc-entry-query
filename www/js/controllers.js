angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})
.controller('EntryDetailCtrl',function($scope,$stateParams, Entries){
  $scope.entry = Entries.get($stateParams.entryId);
})

.controller('AccountCtrl', function($scope, $ionicActionSheet, Entries) {
  $scope.settings = {
    enableFriends: true
  };
  $scope.clearStorage = function(){
    var hideSheet = $ionicActionSheet.show({
      buttons:[],
      destructiveText: '清空存储',
      titleText: '清除所有缓存内容',
      cancelText: '取消',
      cancel: function(){},
      buttonClicked: function(index){
        //console.log(index);
        return true;
      },
      destructiveButtonClicked: function(){
        Entries.clear();
        return true;
      }
    })
  }

})
.controller('PostsCtrl',function($scope,Posts){
  $scope.posts = Posts.all();
})
.controller('BBCCtrl',function($scope){

})

.controller('EntriesCtrl', function($scope,Entries,$timeout,$ionicModal){
  $scope.shouldShowDelete = false;
  $scope.editButtonText = '编辑';
  $scope.adding = false;

  $scope.shoudShowHints = true;
  $scope.entries = [];

  $scope.$watch('entries.length == 0',function(newValue, oldValue){
    if(newValue) {
      $scope.shouldShowHints = true;
    } else {
      $scope.shouldShowHints = false;
    }
  });

  $scope.entries = Entries.all();

  $scope.toggleDelete = function(){
    $scope.editing = !$scope.editing;
    $scope.editButtonText = $scope.editing ? '取消' : '编辑';
  }

  $scope.doRefresh = function(){
    Entries.refresh().then(function(){
      $scope.$broadcast('scroll.refreshComplete');
    });
  }
  $ionicModal.fromTemplateUrl('templates/add-entry-modal.html',{
    scope: $scope,
    //animation: 'slide-in-up'
  }).then(function(modal){
    $scope.modal = modal;
  })

  $scope.secondaryClicked = function(){
      if($scope.editing) { // bulk delete
          var i=0;
          for(i=0;i<$scope.entries.length;i++){
              if($scope.entries[i].selected) {
                  Entries.removeAt(i);
                  i--;
              }
          }
      } else { // add new entry
          $scope.newEntry = "";
          $scope.modal.show();
      }
  };

  $scope.entryClicked = function(entry) {
      if($scope.editing) {
          $scope.toggleEntrySelected(entry);
      }
      //console.log("entry clicked", entry);
  }


  $scope.doAddEntry = function(id){
    $scope.adding = true;
    //console.log("adding: ", id)
    if(typeof(id)!=='undefined' && id !== null && id != ''){
      Entries.add(id)
        .then(function(){
          $scope.modal.hide();
          $scope.status = "";
      },function(err){
          $scope.status = err.message;
      }).then(function(){
        $scope.adding = false;
      })
    } else {
        $scope.adding = false;
        $scope.cancelAddEntry();
    }
};

  $scope.cancelAddEntry = function(){
    $scope.modal.hide();
};

  $scope.$on('$destroy',function(){
    $scope.modal.remove();
});

  $scope.reorderItem = function(fromIndex, toIndex){
      Entries.reorder(fromIndex, toIndex);
};
    $scope.removeEntry = function(index) {
        Entries.removeAt(index);
    };

  $scope.toggleEntrySelected = function(entry){
      if(typeof(entry.selected) === 'undefined' || entry.selected === null || entry.selected === false){
          entry.selected = true;
      } else {
          entry.selected = false;
      }
  };
})

;
