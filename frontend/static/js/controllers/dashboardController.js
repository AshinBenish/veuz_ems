app.controller('dashboardController', ['$scope', 'ApiService', 'ToastService', '$timeout', function ($scope, ApiService, ToastService, $timeout) {
    $scope.userName = localStorage.getItem('username');
    
}]);