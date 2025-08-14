app.controller('profileController', ['$scope', 'ApiService', 'ToastService', '$timeout', function ($scope, ApiService, ToastService, $timeout) {
    $scope.currentView = "profile";

    $scope.updateProfile = function () {
        ApiService.profileUpdate({
            username: $scope.username,
            email: $scope.email
        }).then(function (response) {
            ToastService.show('success', 'Profile updated successfully.');
            $scope.getProfile();
        }).catch(function (error) {
            let errorMsg;
            if (error.data && error.data.username) {
                errorMsg = error.data.username[0];
            }
            else if (error.data && error.data.email) {
                errorMsg = error.data.email[0];
            }
            else {
                errorMsg = 'An unexpected error occurred.';
            }
            ToastService.show('error', errorMsg);
        })
    };

    $scope.updatePassword = function () {
        if ($scope.newPassword !== $scope.confirmPassword) {
            ToastService.show("error", "Your passwords don't match — please check and try again.");
            return;
        }
        ApiService.passwordUpdate({
            old_password: $scope.oldPassword,
            new_password: $scope.newPassword,
            confirm_password: $scope.confirmPassword
        }).then(function (response) {
            ToastService.show('success', 'Password updated successfully.');
            $timeout(function () {
                $scope.oldPassword = '';
                $scope.newPassword = '';
                $scope.confirmPassword = '';
            }, 1000);
        }).catch(function (error) {
            let errorMsg;
            if (error.data && error.data.old_password) {
                errorMsg = error.data.old_password[0];
            }
            else if (error.data && error.data.new_password) {
                errorMsg = error.data.new_password[0];
            }
            else if (error.data && error.data.confirm_password) {
                errorMsg = error.data.confirm_password[0];
            }
            else {
                errorMsg = 'An unexpected error occurred.';
            }
            ToastService.show('error', errorMsg);
        })
    };

    $scope.getProfile = function () {
        ApiService.getProfile()
            .then(function (response) {
                $scope.profile = response.data;
                $scope.username = $scope.profile.username;
                $scope.email = $scope.profile.email;
            })
            .catch(function (error) {
                console.log(error);
                ToastService.show('error', 'Something went wrong.');
            });

    }
    $scope.getProfile();
}]);