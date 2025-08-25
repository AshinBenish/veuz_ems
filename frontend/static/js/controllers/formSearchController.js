app.controller('formSearchController', ['$scope', 'ApiService', 'ToastService', '$timeout', function ($scope, ApiService, ToastService, $timeout) {
    $scope.advanceFilterVisisble = false;
    $scope.getFilterFields = function () {
        ApiService.fetchDynamicFields().then(function (response) {
            $scope.filterFields = response.data;
        }, function (error) {
            console.log(error);
            ToastService.show('error', 'Something went wrong.');
        }).finally(function () {
            $scope.isLoading = false;
        });
    }

    $scope.addFilter = function () {
        $scope.filterList.push({
            field: null,
            value: null
        });
    }

    $scope.removeFilter = function (filter) {
        var index = $scope.filterList.indexOf(filter);
        if (index !== -1) {
            $scope.filterList.splice(index, 1);
        }
    }

    $scope.search = function () {
        $scope.isLoading = true;
        var filterData = $scope.filterList
            .filter(f => f.field && f.value)
            .reduce((acc, f) => {
                acc[f.field] = f.value;
                return acc;
            }, {});

        var payload = {
            filters: filterData,
            keyword: $scope.searchQuery
        };
        console.log(payload);
        ApiService.searchEmployee(payload).then(function (response) {
            $scope.employees = response.data;
            console.log($scope.employees);
        }).catch(function (error) {
            ToastService.show('error', 'Something went wrong.');
        }).finally(function () {
            $scope.isLoading = false;
        });
    }

    const editModalElement = document.getElementById('edit-modal');
    const editModal = new Modal(editModalElement, {
        backdrop: 'static',
        keyboard: false
    });
    const deleteModalElement = document.getElementById('delete-modal');
    const deleteModal = new Modal(deleteModalElement, {
        backdrop: 'static',
        keyboard: false
    });

    function convertFieldValue(value, type) {
        if (value == null) return value;

        if (type === 'date') {
            return new Date(value);
        }
        if (type === 'number') {
            var num = Number(value);
            return isNaN(num) ? value : num;
        }
        return value;
    }

    $scope.editEmployee = function (employeeId) {
        editModal.show();
        $scope.employeeData = {};
        ApiService.getEmploeeData(employeeId).then(function (response) {
            $scope.employeeData = response.data;
            $scope.employeeData.fields = $scope.employeeData.fields.map(field => {
                field.value = convertFieldValue(field.value, field.field_type_name);
                return field;
            });
        })
    }

    $scope.updateEmployee = function (employeeId) {
        if ($scope.employeeForm.$invalid) {
            // Mark all fields as touched
            angular.forEach($scope.employeeForm.$error, function (field) {
                angular.forEach(field, function (errorField) {
                    errorField.$setTouched();
                });
            });
            ToastService.show('error', 'Please fill all required fields.');
            return;
        }
        ApiService.updateEmployee(employeeId, $scope.employeeData).then(function (response) {
            ToastService.show('success', 'Employee updated successfully.');
            editModal.hide();
            $scope.search();
        }).catch(function (error) {
            console.log(error);
            ToastService.show('error', 'Something went wrong.');
        }).finally(function () {
        });

    }

    $scope.deleteModal = function (employeeId) {
        deleteModal.show();
        $scope.deleteEmployeeId = employeeId;
    }

    $scope.deleteEmploee = function () {
        ApiService.deleteEmployee($scope.deleteEmployeeId).then(function (response) {
            ToastService.show('success', 'Employee deleted successfully.');
            deleteModal.hide();
            $scope.search();
        }).catch(function (error) {
            ToastService.show('error', 'Something went wrong.');
        }).finally(function () {
        });
    }



    $scope.closeEditModal = function () {
        editModal.hide();
    };

    $scope.filterList = [];
    $scope.employees = [];
    $scope.getFilterFields();
    $scope.search();

}]);

app.filter('customDate', function ($filter) {
    return function (input) {
        if (!input) return '';
        var dateObj = new Date(input);
        return $filter('date')(dateObj, 'dd-MMM-yyyy hh:mm a');
    };
});