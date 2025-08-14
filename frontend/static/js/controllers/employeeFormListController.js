app.controller('employeeFormListController', ['$scope', 'ApiService', 'ToastService', '$timeout', function ($scope, ApiService, ToastService, $timeout) {
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

    $scope.resetForm = function () {
        $scope.formValues = {};
        $scope.fieldErrors = {};
        $scope.closePreview();
    };


    $scope.createEmployee = function () {
        let hasError = false;
        $scope.fieldErrors = {};

        $scope.fields.forEach(function (field, index) {
            if (field.required && (!$scope.formValues[field.id] || $scope.formValues[field.id] === '')) {
                $scope.fieldErrors[field.id] = true;
                hasError = true;
            }
        });

        if (hasError) {
            ToastService.show('error', 'Please fill all required fields.');
            return;
        };

        Object.entries($scope.formValues)

        var payload = {
            form_id: $scope.selectedForm.id,
            fields: Object.entries($scope.formValues).map(([key, value]) => ({
                field_id: key,
                value: value
            }))
        };

        ApiService.createEmployee(payload).then(function (response) {
            ToastService.show('success', 'Employee created successfully.');
            $scope.resetForm();
            console.log(response.data);
        }).catch(function (error) {
            ToastService.show('error', 'Something went wrong.');
            console.log(error);
        }).finally(function () {
        });

    }

    $scope.formValues = {};
    $scope.fieldErrors = {};
    $scope.formData = [];
    $scope.getFieldTyeps();
    $scope.fetchForms();
}]);