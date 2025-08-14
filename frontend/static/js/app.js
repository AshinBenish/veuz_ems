var app = angular.module('emsApp', []);

app.factory('authService', function ($http, $q) {
    const baseUrl = 'http://127.0.0.1:8000/api/';

    function setTokens(accessToken, refreshToken) {
        localStorage.setItem('accessToken', accessToken);
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        }
    }

    return {
        login: function (username, password) {
            return $http.post(baseUrl + 'auth/login/', { username, password })
                .then(function (response) {
                    setTokens(response.data.access, response.data.refresh);
                    localStorage.setItem('username', username);
                    return response.data;
                });
        },

        refreshToken: function () {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) return $q.reject('No refresh token');

            return $http.post(baseUrl + 'auth/refresh/', { refreshToken })
                .then(function (response) {
                    setTokens(response.data.access);
                    return response.data.access;
                });
        },

        register: function (username, email, password) {
            return $http.post(baseUrl + 'auth/register/', { username, email, password })
                .then(function (response) {
                    setTokens(response.data.access, response.data.refresh);
                    localStorage.setItem('username', username);
                    return response.data;
                });
        },


        logout: function () {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('username');
            window.location = '/login/';
        },

        getAccessToken: function () {
            return localStorage.getItem('accessToken');
        }
    };
});


app.factory('authInterceptor', function ($q, $injector) {
    return {
        request: function (config) {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers['Authorization'] = 'Bearer ' + token;
            }
            return config;
        },

        responseError: function (rejection) {
            const $http = $injector.get('$http');
            const authService = $injector.get('authService');

            // If unauthorized and we haven't retried yet
            if (rejection.status === 401 && !rejection.config.__isRetryRequest) {
                return authService.refreshToken()
                    .then(function (newToken) {
                        // Retry original request with new token
                        rejection.config.__isRetryRequest = true;
                        rejection.config.headers['Authorization'] = 'Bearer ' + newToken;
                        return $http(rejection.config);
                    })
                    .catch(function () {
                        // Refresh failed → logout
                        authService.logout();
                        return $q.reject(rejection);
                    });
            }

            return $q.reject(rejection);
        }
    };
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
});