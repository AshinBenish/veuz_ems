app.service('ApiService', ['$http', function ($http) {

    const baseUrl = 'http://127.0.0.1:8000/api/';

    this.getFieldTypes = function () {
        return $http.get(baseUrl + 'field-types/');
    }

    this.createForm = function (data) {
        return $http({
            method: 'POST',
            url: baseUrl + 'forms/',
            data: data
        });
    };

    this.updateForm = function (formId, data) {
        return $http({
            method: 'PUT',
            url: baseUrl + 'forms/'+formId+'/',
            data: data
        });
    };

    this.fetchForms = function () {
        return $http({
            method: 'GET',
            url: baseUrl + 'forms/',
        });
    };

    this.getFormData = function (formId) {
        return $http({
            method: 'GET',
            url: baseUrl + 'forms/'+formId+'/',
        });
    };
    
    this.createEmployee = function (data) {
        return $http({
            method: 'POST',
            url: baseUrl + 'employee/create/',
            data: data
        });
    };

    this.fetchDynamicFields = function () {
        return $http({
            method: 'GET',
            url: baseUrl + 'dynamic/fields/',
        });
    
    }

    this.searchEmployee = function (data) {
        return $http({
            method: 'POST',
            url: baseUrl + 'employee/search/',
            data: data
        });
    };

    this.getEmploeeData = function (employeeId) {
        return $http({
            method: 'GET',
            url: baseUrl + 'employee/'+employeeId+'/',
        });
    };

    this.updateEmployee = function (employeeId, data) {
        return $http({
            method: 'PUT',
            url: baseUrl + 'employee/'+employeeId+'/',
            data: data
        });
    };

    this.deleteEmployee = function (employeeId) {
        return $http({
            method: 'DELETE',
            url: baseUrl + 'employee/'+employeeId+'/',
        });
    };

}]);