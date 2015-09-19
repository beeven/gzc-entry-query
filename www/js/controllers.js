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

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('EntriesCtrl', function($scope,Entries,$timeout,$ionicModal){
  $scope.shouldShowDelete = false;
  $scope.editButtonText = 'Edit';
  $scope.adding = false;

  $scope.toggleDelete = function(){
    $scope.editing = !$scope.editing;
    $scope.editButtonText = $scope.editing ? 'Done' : 'Edit';
  }
  $scope.entries = Entries.all();
  $scope.doRefresh = function(){
    $timeout(function(){
      $scope.$broadcast('scroll.refreshComplete');
    },1000)
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
          $scope.modal.show();
      }
  };

  $scope.entryClicked = function(entry) {
      if($scope.editing) {
          $scope.toggleEntrySelected(entry);
      }
      console.log("entry clicked", entry);
  }


  $scope.doAddEntry = function(id){
    $scope.adding = true;
    console.log("adding: ", id)
    if(id != ''){
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

    }
};

  $scope.cancelAddEntry = function(){
    $scope.modal.hide();
};

  $scope.$on('$destroy',function(){
    $scope.modal.remove();
});

  $scope.reorderItem = function(entry, fromIndex, toIndex){
    $scope.entries.splice(fromIndex,1);
    $scope.entries.splice(toIndex,0,entry);
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
