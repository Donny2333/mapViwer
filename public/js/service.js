/**
 * Created by Donny on 17/5/2.
 */
angular.module('mapViewer.service', [])
    .factory('Http', ["$q", "$http", function ($q, $http) {
        return {
            get: function (url) {
                var deferred = $q.defer();

                $http.get(url).then(function (res) {
                    deferred.resolve(res);
                }, function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            },
            post: function (url, param) {
                var deferred = $q.defer();

                $http.post(url, param).then(function (res) {
                    deferred.resolve(res);
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
    }])

    .factory('Map', ['Http', 'URL_CFG', function (Http, URL_CFG) {
        var url = URL_CFG.api + "GetMapDocList";

        return {
            load: function (url, query) {
                return Http.get(ol.uri.appendParams(url, query || {}));
            },
            identify: function (url, query) {
                return Http.get(ol.uri.appendParams(url + '/identify', query || {}));
            }
        }
    }]);