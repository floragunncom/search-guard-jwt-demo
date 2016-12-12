(function () {
    'use strict';

    angular.module('app', [
        'ngStorage',
        'ngRoute',
        'angular-loading-bar'
    ])
        .constant('urls', {
            BASE_JWT: 'http://localhost:3001',
            BASE_ES: 'https://localhost:9200'
        })
        .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
            $routeProvider.
                when('/', {
                    templateUrl: 'partials/home.html',
                    controller: 'HomeController'
                }).
                when('/users', {
                    templateUrl: 'partials/users.html',
                    controller: 'UsersController'
                }).
                when('/signin', {
                    templateUrl: 'partials/signin.html',
                    controller: 'HomeController'
                }).
                when('/signup', {
                    templateUrl: 'partials/signup.html',
                    controller: 'HomeController'
                }).
                when('/authinfo', {
                    templateUrl: 'partials/authinfo.html',
                    controller: 'AuthinfoController'
                }).
                when('/query', {
                    templateUrl: 'partials/query.html',
                    controller: 'QueryController'
                }).
                otherwise({
                    redirectTo: '/'
                });

            $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
                return {
                    'request': function (config) {
                        config.headers = config.headers || {};
                        if ($localStorage.token) {
                            config.headers.Authorization = 'Bearer ' + $localStorage.token;
                        }
                        return config;
                    },
                    'responseError': function (response) {
                        if (response.status === 401 || response.status === 403) {
                        }
                        return $q.reject(response);
                    }
                };
            }]);
        }
        ]).run(function($rootScope, $location, $localStorage) {
            $rootScope.$on( "$routeChangeStart", function(event, next) {
                if ($localStorage.token == null) {
                    if ( next.templateUrl === "partials/restricted.html") {
                        $location.path("/signin");
                    }
                }
            });
        });
})();