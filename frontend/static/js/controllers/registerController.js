app.controller('registerController', ['$scope', 'ApiService','authService', 'ToastService', '$timeout', function ($scope, ApiService, authService, ToastService, $timeout) {
    
    $scope.register = function () {
        if ($scope.password !== $scope.confirmPassword) {
            ToastService.show("error", "Your passwords don't match — please check and try again.");
            return;
        }
        authService.register($scope.username, $scope.email, $scope.password)
            .then(function (response) {
                ToastService.show('success', 'Registration successful.');
                $timeout(function () {
                    window.location = '/';
                }, 1000);
            })
            .catch(function (error) {
                let errorMsg;
                if (error.data && error.data.username) {
                    errorMsg = error.data.username[0];
                } else if (error.data && error.data.email) {
                    errorMsg = error.data.email[0];
                } else if (error.data && error.data.password) {
                    errorMsg = error.data.password[0];
                } else {
                    errorMsg = 'An unexpected error occurred.';
                }
                ToastService.show('error', errorMsg);
            });
    };

}]);