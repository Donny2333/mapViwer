/**
 * Created by Donny on 17/5/2.
 */
angular.module('mapViewer', [
    aol.moduleName,
    'mapViewer.config',
    'mapViewer.service'
])
    .controller('AppController', ['$scope', 'Cookie', function ($scope, Cookie) {
        var url = "http://192.168.99.82:6080/arcgis/rest/services/MyMapService/MapServer";

        var vm = $scope.vm = {
            url: url
        };

        console.log(Cookie.getCookie('ID'));
    }]);