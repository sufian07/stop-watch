angular.module('stopWatchApp')
    .filter('counterValue', counterValueFilter);

function counterValueFilter() {
    return function(value) {
        if (isNaN(value)) return value;
        if (value >= 0 && value < 10) return "0" + parseInt(value);
        return "" + parseInt(value);
    }
}