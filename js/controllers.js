(function () {
    'use strict';

    angular.module('app')
        .controller('HomeController', ['$rootScope', '$scope', '$location', '$localStorage', 'Auth',
            function ($rootScope, $scope, $location, $localStorage, Auth) {

                $rootScope.error = '';
                $rootScope.tokenClaims = Auth.getTokenClaims();
                $rootScope.token = $localStorage.token;
                $scope.authinfo = '';

                function successAuth(res) {
                    $localStorage.token = res.token;
                    $rootScope.error = '';
                    $rootScope.token = $localStorage.token;
                    $location.path('/')
                }

                $scope.signin = function () {
                    var formData = {
                        username: $scope.username,
                        password: $scope.password
                    };

                    Auth.signin(formData, successAuth, function () {
                        $rootScope.error = 'Invalid credentials.';
                    })
                };

                $scope.signup = function () {
                    var formData = {
                        username: $scope.username,
                        password: $scope.password,
                        roles: $scope.roles,
                    };

                    Auth.signup(formData, successAuth, function (res) {
                        $rootScope.error = res.error || 'Failed to sign up.';
                    })
                };

                $scope.logout = function () {
                    Auth.logout(function () {
                        $rootScope.error = '';
                        $rootScope.token = '';
                        $rootScope.tokenClaims = '';
                        $location.path('/signin')
                    });
                };

                $scope.authinfo = function () {
                    $http.get(urls.BASE_ES + '/_searchguard/authinfo?pretty')
                        .success(function (data) {
                            $scope.authinfo = data;
                        })
                        .success(function (data) {
                            $scope.authinfo = data;
                        })
                };

            }])


        .controller('AuthinfoController', ['$rootScope', '$scope', '$location', '$localStorage', 'Auth', '$http', 'urls',
            function ($rootScope, $scope, $location, $localStorage, Auth, $http, urls) {

                $rootScope.error = '';
                $rootScope.tokenClaims = Auth.getTokenClaims();
                $rootScope.token = $localStorage.token;
                $scope.authinfo = '';

                $http.get(urls.BASE_ES + '/_searchguard/authinfo?pretty=true')
                    .success(function (data) {
                        $scope.authinfo = JSON.stringify(data, undefined, 2);
                    })
                    .error(function (data) {
                        $scope.authinfo = JSON.stringify(data, undefined, 2);
                    })


            }])

        .controller('QueryController', ['$rootScope', '$scope', '$location', '$localStorage', 'Auth', '$http', 'urls',
            function ($rootScope, $scope, $location, $localStorage, Auth, $http, urls) {

                $scope.executequery = function () {
                    $http.post(urls.BASE_ES + '/' + $scope.index + '/' + $scope.type,$scope.query )
                        .success(function (data) {
                            $scope.queryresult = data;
                        })
                        .error(function (data) {
                            $scope.queryresult = JSON.stringify(data, undefined, 2);
                        })
                };
            }])

})();