/**
 * Created by Donny on 17/5/2.
 */
angular.module('mapViewer.service', [])
    .factory('Cookie', function () {
        return {
            getCookie: function (name) {
                var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
                if (arr = document.cookie.match(reg)) {
                    return unescape(arr[2]);
                }
                else {
                    return null;
                }
            }
        }
    })

    .factory('Http', ["$q", "$http", function ($q, $http) {
        return {
            get: function (url) {
                var deferred = $q.defer();

                $http.get(url).then(function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            },
            post: function (url, param) {
                var deferred = $q.defer();

                $http.post(url, param).then(function (res) {
                    deferred.resolve(res.data);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }
        }
    }])

    .factory("Gallery", ["Http", "URL_CFG", function (Http, URL_CFG) {
        var url = URL_CFG.api + "GetMapDocList";

        return {
            get: function () {
                return Http.get(url);
            },
            post: function (param) {
                return Http.post(url, param);
            }
        }
    }]);