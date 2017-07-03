angular.module('stopWatchApp')
    .controller(
        "AppController", [
            '$scope',
            '$rootScope',
            '$localStorage',
            '$interval',
            AppController
        ]
    );

function AppController($scope, $rootScope, $localStorage, $interval) {

    var currentElapsedTime = 0;

    $scope.$storage = $localStorage;
    $scope.reset = function() {
        currentElapsedTime = 0;
        $scope.$storage.play = false;
        $scope.$storage.startTime = null;
        $scope.$storage.totalElapsedTime = 0;
        $scope.time = {
            number: 0,
            m: 0,
            s: 0,
            c: 0
        };
        $scope.$storage.times = [];
    };

    $scope.tooglePlay = function() {
        $scope.$storage.play = !$scope.$storage.play;
        if ($scope.$storage.play) {
            playWatch();
        } else {
            pauseWatch();
        }
    };

    $scope.addTime = function() {
        $scope.$storage.times.push(angular.copy($scope.time));
    };

    $scope.removeTime = function(t) {
        $scope.$storage.times = $scope.$storage.times.filter(function(time) {
            return time.number !== t.number
        });
    };

    $interval(function() {
        $scope.time = {};
        updateTimer();
    }, 100);

    function playWatch() {
        if (!$scope.$storage.startTime) {
            $scope.$storage.startTime = new Date();
        }
    }

    function pauseWatch() {
        $scope.$storage.startTime = null;
        $scope.$storage.totalElapsedTime += currentElapsedTime;
        currentElapsedTime = 0;
    }

    function getCurrentElapsedTime() {
        var now = new Date();
        var start = new Date($scope.$storage.startTime);
        return (now.getTime() - start.getTime()) / 10;
    }

    function updateTimer() {
        if ($scope.$storage.play) {
            currentElapsedTime = getCurrentElapsedTime();
            $scope.time.number = $scope.$storage.totalElapsedTime + currentElapsedTime;
            calculateTime();
        } else {
            $scope.time.number = $scope.$storage.totalElapsedTime;
            calculateTime();
        }
    }

    function calculateTime() {
        var minuteReminder;
        minuteReminder = $scope.time.number % 6000;
        $scope.time.m = Math.floor($scope.time.number / 6000);
        $scope.time.s = Math.floor(minuteReminder / 100);
        $scope.time.c = minuteReminder % 100;
    }

}