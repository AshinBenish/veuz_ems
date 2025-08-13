app.service('ApiService', ['$http', function ($http) {

    const baseUrl = 'http://127.0.0.1:8000/api/';

    this.getFieldTypes = function () {
        return $http.get(baseUrl + 'field-types/');
    }

    this.createForm = function (data, accessToken) {
        return $http({
            method: 'POST',
            url: baseUrl + 'forms/',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            data: data
        });
    };

    this.updateForm = function (formId, data, accessToken) {
        return $http({
            method: 'PUT',
            url: baseUrl + 'forms/'+formId+'/',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            data: data
        });
    };

    this.fetchForms = function (accessToken) {
        return $http({
            method: 'GET',
            url: baseUrl + 'forms/',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });
    };

    this.getFormData = function (accessToken,formId) {
        return $http({
            method: 'GET',
            url: baseUrl + 'forms/'+formId+'/',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });
    };
    

}]);