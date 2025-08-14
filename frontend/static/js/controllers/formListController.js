app.controller('formListController', ['$scope', 'ApiService', 'ToastService', '$timeout', function ($scope, ApiService, ToastService, $timeout) {
    $scope.fetchForms = function () {
        ApiService.fetchForms().then(function (response) {
            console.log(response);
            $scope.formData = response.data;
        }).catch(function (error) {
            console.log(error);
            ToastService.show('error', 'Something went wrong.');
        }).finally(function () {
        })
    }
    $scope.formData = [];
    $scope.fetchForms();
}]);

app.filter('customDate', function($filter) {
    return function(input) {
        if (!input) return '';
        var dateObj = new Date(input);
        return $filter('date')(dateObj, 'dd-MMM-yyyy hh:mm a');
    };
});
