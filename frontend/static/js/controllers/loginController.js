app.controller('loginController', ['$scope', 'ApiService','authService', 'ToastService', '$timeout', function ($scope, ApiService, authService, ToastService, $timeout) {
    $scope.login = function () {
        $scope.isLoading = true;
        authService.login($scope.username, $scope.password).then(function (response) {
            console.log(response);
            ToastService.show('success', 'Login successfully');
            $timeout(function () {
                window.location.href = '/';
            }, 1000);
        }).catch(function (error) {
            console.log(error);
            ToastService.show('error', error.data.detail);
        }).finally(function () {
            $scope.isLoading = false;
        });
    
    }

}]);