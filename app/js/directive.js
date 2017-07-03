angular.module('stopWatchApp').directive('clock', clockDirective);

function clockDirective() {
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        templateUrl: 'templates/clock.html',
        scope: {
            minute: "@",
            second: "@",
            centi: "@",
            status: "@"
        },
        controller: ['$scope', '$filter', function($scope, $filter) {
            var keys = ['minute', 'second', 'centi'];
            var status = false;

            makeHtml();
            $scope.$watch("centi", function() {
                makeHtml();
            });
            $scope.$watch("status", function() {
                status = ($scope.status == 'true') ? true : false;
            });

            $scope.getClass = function(letter) {
                switch (letter) {
                    case ':':
                        if (status) {
                            return 'colon blink';
                        } else {
                            return 'colon';
                        }
                    case '.':
                        if (status) {
                            return 'colon blink';
                        } else {
                            return 'colon';
                        }
                    default:
                        return '';
                }
            };

            function makeHtml() {
                var letters = [];
                var valeus = {};
                keys.map(function(key, index, array) {
                    valeus[key] = $scope[key] || 0;
                    valeus[key] = $filter('counterValue')(valeus[key]);
                    for (letter of valeus[key]) {
                        letters.push(letter);
                    }
                    if (index == 0) {
                        letters.push(":");
                    }
                    if (index == 1) {
                        letters.push(".");
                    }
                });
                $scope.letters = letters;
            }
        }]
    };
}