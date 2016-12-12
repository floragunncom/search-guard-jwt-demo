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
                        $scope.authinfo = "No info available, make sure you are logged in.";
                    })


            }])

        .controller('UsersController', ['$rootScope', '$scope', '$location', '$localStorage', 'Auth', '$http', 'urls',
            function ($rootScope, $scope, $location, $localStorage, Auth, $http, urls) {

                $rootScope.error = '';
                $rootScope.tokenClaims = Auth.getTokenClaims();
                $rootScope.token = $localStorage.token;
                $scope.authinfo = '';

                $http.get(urls.BASE_JWT + '/users')
                    .success(function (data) {
                        $scope.users = data;
                    })
                    .error(function (data) {
                        $rootScope.error = 'Could not fetch users.';
                    })


            }])

        .controller('QueryController', ['$rootScope', '$scope', '$location', '$localStorage', 'Auth', '$http', 'urls',
            function ($rootScope, $scope, $location, $localStorage, Auth, $http, urls) {

                $scope.method = "GET";

                $scope.executequery = function () {
                    $http.post(urls.BASE_ES + '/' + $scope.index + '/' + $scope.type+'/_search?pretty=true',$scope.query )
                        .success(function (data) {
                            $scope.queryresult = JSON.stringify(data, undefined, 2);
                        })
                        .error(function (data) {
                            $scope.queryresult = JSON.stringify(data, undefined, 2);
                        })

                };

                $scope.sc_all_employees = function () {
                    $scope.sc_employees();
                    $scope.createquery(matchall);
                };

                $scope.sc_all_manager = function () {
                    $scope.sc_employees();
                    $scope.createquery(manager);
                };

                $scope.sc_ceo = function () {
                    $scope.sc_employees();
                    $scope.createquery(ceo);
                }

                $scope.sc_sum_salary = function () {
                    $scope.sc_employees();
                    var query = '{ "query" : { "match_all": {} }, "aggs" : { "salary_total" : { "sum" : { "field" : "Salary" } } } }';
                    $scope.query = JSON.stringify(JSON.parse(query), undefined, 2);
                }

                $scope.sc_all_revenue = function () {
                    $scope.sc_revenue();
                    $scope.createquery(matchall);
                };

                $scope.sc_employees = function () {
                    $scope.index = 'companydatabase';
                    $scope.type = 'employees';
                };

                $scope.sc_revenue = function () {
                    $scope.index = 'companyrevenue';
                    $scope.type = 'revenue';
                };

                $scope.createquery = function (querystub) {
                    var query = '{"query": {' +querystub + '}}';
                    $scope.query = JSON.stringify(JSON.parse(query), undefined, 2);
                }

                var matchall = '"match_all": {}';
                var ceo='"match": { "Designation": "CEO" }'
                var manager='"match": { "Designation": "Manager" }'
            }])

})();