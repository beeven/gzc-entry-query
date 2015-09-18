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
    $scope.shouldShowDelete = !$scope.shouldShowDelete;
    $scope.editButtonText = $scope.shouldShowDelete ? 'Done' : 'Edit';
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

  $scope.addEntry = function(){
    $scope.modal.show();
  }

  $scope.doAddEntry = function(id){
    $scope.adding = true;
    console.log("adding: ", id)
    if(id != ''){
      Entries.add(id)
        .then(function(){
          $scope.modal.hide();
          console.log($scope.entries);
      },function(err){

      }).then(function(){
        $scope.adding = false;
      })
    } else {

    }
  }

  $scope.cancelAddEntry = function(){
    $scope.modal.hide();
  }

  $scope.$on('$destroy',function(){
    $scope.modal.remove();
  })

  $scope.reorderItem = function(entry, fromIndex, toIndex){
    $scope.entries.splice(fromIndex,1);
    $scope.entries.splice(toIndex,0,entry);
  }
})

;
