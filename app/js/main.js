angular.module('stopWatchApp', ['ngStorage'])
    .filter('counterValue', counterValueFilter)
    .controller("AppController", ['$scope', '$rootScope', '$localStorage', '$timeout', AppController])
    .directive('clock', clockDirective);

function counterValueFilter() {
    return function(value) {
        if (isNaN(value)) return value;
        if (value >= 0 && value < 10) return "0" + parseInt(value);
        return "" + parseInt(value);
    }
}

function AppController($scope, $rootScope, $localStorage, $timeout) {

    $scope.$storage = $localStorage;
    $scope.init = function() {
        $scope.$storage.play = false;
        $scope.$storage.time = {
            number: 0,
            m: 0,
            s: 0,
            c: 0
        };
        $scope.$storage.times = [];
    };

    $scope.tooglePlay = function() {
        $scope.$storage.play = !$scope.$storage.play;
         runTimer();
    };

    $scope.addTime = function() {
        $scope.$storage.times.push(angular.copy($scope.$storage.time));
    };

    $scope.removeTime = function(t) {
        $scope.$storage.times = $scope.$storage.times.filter(function(time) {
            return time.number !== t.number
        });
    };

    var LOCAL_DATA = {
        PLAY: 'play',
        TIME: 'time',
        TIMES: 'times',
    }


    if ($scope.$storage.time && $scope.$storage.time.number > 0) {
        if ($scope.$storage.play) {
            $scope.$storage.play = !$scope.$storage.play;
            $scope.tooglePlay();
        }
    } else {
        $scope.init();
    }

    function runTimer() {
        if ($scope.$storage.play) {
            $scope.$storage.time.number++;
            calculateTime();
            $timeout(runTimer, 10);
        }
    }

    function calculateTime() {
        $scope.$storage.time.m = Math.floor($scope.$storage.time.number / 6000);
        $scope.$storage.time.s = Math.floor(($scope.$storage.time.number - ($scope.$storage.time.m * 6000)) / 100);
        $scope.$storage.time.c = $scope.$storage.time.number - (($scope.$storage.time.m * 6000) + ($scope.$storage.time.s * 100));
    }

}

function clockDirective() {
    var template = '<div class="clock"><span class="clock-font" ng-bind-html="html"></span>' +
        '<span class="clock-font cloned"><span>0</span><span>0</span><span class="colon"> : </span><span>0</span><span>0</span><span class="colon"> : </span><span>0</span><span>0</span></span></div>'
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        template: template,
        scope: {
            minute: "=",
            second: "=",
            centi: "="
        },
        controller: ['$scope', '$filter', '$sce', function($scope, $filter, $sce) {
            makeHtml();
            $scope.$watch("centi", function() {
                makeHtml();
                console.log($scope["centi"]);
            });

            function makeHtml() {
                var keys = ['minute', 'second', 'centi'];
                var tempHtml = '';

                keys.map(function(key, index, array) {
                    $scope[key] = $scope[key] || 0;
                    $scope[key] = $filter('counterValue')($scope[key]);
                    for (letter of $scope[key]) {
                        tempHtml += '<span>' + letter + '</span>';
                    }
                    if (index < array.length - 1) {
                        tempHtml += '<span class="colon"> : </span>';
                    }
                });
                $scope.html = $sce.trustAsHtml(tempHtml);
            }
        }]
    };
}