/**
 * Created by Donny on 17/5/2.
 */
angular.module('mapViewer', [
    aol.moduleName,
    'mapViewer.config',
    'mapViewer.service'
])
    .controller('AppController', ['$scope', 'Gallery', function ($scope, Gallery) {
        var url = "http://192.168.99.82:6080/arcgis/rest/services/MyMapService/MapServer";

        var vm = $scope.vm = {
            url: url
        };

        // TODO: query map url by ID
        var e = document.getElementById('vm.id');
        console.log(e.value);
        // Gallery.post({
        //
        // }).then(function (data) {
        //
        // })
    }]);