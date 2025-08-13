app.controller('formListController', ['$scope', 'ApiService', 'ToastService', '$timeout', function ($scope, ApiService, ToastService, $timeout) {
    $scope.fetchForms = function () {
        var access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU1MTM3NzczLCJpYXQiOjE3NTUwOTQ1NzMsImp0aSI6ImZmNmM0OTQ4ZjZhYjRlNzhiNWQ2M2U1NmJmYzEzODhhIiwidXNlcl9pZCI6IjEifQ.r4LIXF2O9LYRQ_p2ULXGTlUsTzDT3SmBxUDW7PsI_f8";
        ApiService.fetchForms(access_token).then(function (response) {
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
