app.controller('employeeFormListController', ['$scope', 'ApiService', 'ToastService', '$timeout', function ($scope, ApiService, ToastService, $timeout) {
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

    $scope.getFieldTyeps = function () {
        ApiService.getFieldTypes().then(function (response) {
            $scope.fieldTypes = response.data;
            console.log($scope.fieldTypes);
        }).catch(function (error) {
            console.log(error);
        }).finally(function () {

        })
    }

    $scope.updateFieldTypeName = function (field) {
        var type_name = $scope.fieldTypes.find(data => data.id == field.field_type);
        field.type_name = type_name ? type_name.name : '';
    }

    $scope.setForm = function () {
        if (!$scope.fields) return;

        $scope.fields.forEach(function (field) {
            $scope.updateFieldTypeName(field);
        });
    }

    const modalElement = document.getElementById('preview-modal');
    const modal = new Modal(modalElement, {
      backdrop: 'static',
      keyboard: false 
    });
    $scope.openPreview = function (form) {
        // Using Flowbite's Modal JavaScript API
        modal.show();
        $scope.fields = form.fields;
        $scope.form_name = form.name;
        $scope.selectedForm = form;
        $scope.setForm();
    };
    $scope.closePreview = function () {
        modal.hide();
    };

    $scope.formData = [];
    $scope.getFieldTyeps();
    $scope.fetchForms();
}]);