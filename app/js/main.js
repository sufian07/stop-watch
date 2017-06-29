angular.module('stopWatchApp', [])
    .filter('counterValue', counterValueFilter)
    .factory('storage', ['$window', storageFactory])
    .controller("AppController", ['$scope', '$rootScope', 'storage', '$timeout', AppController])
    .directive('clock',clockDirective);

function counterValueFilter(){
   return function(value){
      if(isNaN(value)) return value;
      if(value >= 0 && value < 10) return "0"+parseInt(value);
      return ""+parseInt(value);
   }
}

function storageFactory($window) {
    return{
        set: function(key,data){
            $window.localStorage.setItem(key, JSON.stringify(data));
        },
        get: function(key){
           return JSON.parse(localStorage.getItem(key));
        }
    };
}

function AppController($scope, $rootScope, storage, $timeout) {

    $scope.init = function() {
        $scope.play = false;
        $scope.time = {
            number: 0,
            m: 0,
            s: 0,
            c: 0
        };
        $scope.times = [];
        updateLocalStorage();
    };
    
    $scope.tooglePlay = function() {
        getFromLocalStorage();
        $scope.play =  !$scope.play;
        updateLocalStorage();
        runTimer();
    };

    $scope.addTime = function(){
        getFromLocalStorage();
        $scope.times.push(angular.copy($scope.time));
        updateLocalStorage();
    };

    $scope.removeTime = function(t){
        getFromLocalStorage();
        $scope.times = $scope.times.filter(function(time){
            return time.number !== t.number
        });
        updateLocalStorage();
    };

    var LOCAL_DATA = {
        PLAY:  'play',
        TIME:  'time',
        TIMES:  'times',
    }

    var temp = storage.get(LOCAL_DATA.TIME);

    if(temp && temp.number > 0){
        getFromLocalStorage();
        if($scope.play){
            $scope.play =  !$scope.play;
            updateLocalStorage();
            $scope.tooglePlay();
        }
    }else{
        $scope.init();
    }

    function runTimer(){
        if($scope.play){
            getFromLocalStorage();
            $scope.time.number++;
            calculateTime();
            $timeout(runTimer, 10);
        }
    }

    function calculateTime() {
        $scope.time.m = Math.floor($scope.time.number / 6000);
        $scope.time.s = Math.floor(($scope.time.number - ($scope.time.m * 6000)) / 100);
        $scope.time.c = $scope.time.number - (($scope.time.m * 6000) + ($scope.time.s * 100));
        updateLocalStorage();
        //console.log($scope.time.m, $scope.time.s, $scope.time.c);
    }

    function updateLocalStorage(){
        Object.values(LOCAL_DATA).map(function(key){
            storage.set(key,$scope[key]);
        });
    }

    function getFromLocalStorage(){
        Object.values(LOCAL_DATA).map(function(key){
            $scope[key]=storage.get(key)
        });
    }
}

function clockDirective(){
    var template = '<div class="clock"><span class="clock-font" ng-bind-html="html"></span>'
                    +'<span class="clock-font cloned"><span>0</span><span>0</span><span class="colon"> : </span><span>0</span><span>0</span><span class="colon"> : </span><span>0</span><span>0</span></span></div>'
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        template: template,
        scope:{
            minute: "=", 
            second: "=", 
            centi: "="
        },
        controller:['$scope','$filter','$sce',function($scope,$filter,$sce){
            makeHtml();
            $scope.$watch("centi",function(){
                makeHtml();
                console.log($scope["centi"]);
            });
            function makeHtml(){
                var keys = ['minute','second','centi'];
                var tempHtml = '';

                keys.map(function(key,index,array){
                    $scope[key] = $scope[key] || 0;
                    $scope[key] = $filter('counterValue')($scope[key]);
                    for (letter of $scope[key]) {
                        tempHtml += '<span>'+letter+'</span>';
                    }
                    if(index<array.length-1){
                        tempHtml += '<span class="colon"> : </span>';
                    }
                });
                $scope.html = $sce.trustAsHtml(tempHtml);
            }
        }],
        link: ['$scope', '$element', 'attr',function($scope, $element, attr){

        }]
    };
}