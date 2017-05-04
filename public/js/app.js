/**
 * Created by Donny on 17/5/2.
 */
angular.module('mapViewer', [
    aol.moduleName,
    'mapViewer.config',
    'mapViewer.service'
])
    .controller('AppController', ['$scope', '$timeout', 'Gallery', function ($scope, $timeout, Gallery) {
        var url1 = 'http://192.168.100.5:6080/arcgis/rest/services/IndustryMaps2/01_aqssfbt/MapServer';
        var url2 = 'http://192.168.99.82:6080/arcgis/rest/services/MyMapService/MapServer';
        var url3 = 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/';

        var vm = $scope.vm = {
            extent: [555441.29973, 3581735.6861, 572493.72966, 3589898.0983],
            name: 'None',
            url: ''
        };

        // Todo: query map url by ID
        var id = document.getElementById('vm.id').value;

        // change map url delay
        $timeout(function () {
            vm.name = 'China Map';
            vm.url = url2;
            console.log(vm.url);
        }, 1000);

        // Gallery.post({
        //     docID: '1',
        //     pageNo: 0,
        //     pageNum: 10
        // }).then(function (data) {
        //     vm.url2 = data.result[0].MapServerPath;
        //     vm.name = data.result[0].Name;
        //     vm.extent = [
        //         data.result[0].Xmin,
        //         data.result[0].Ymin,
        //         data.result[0].Xmax,
        //         data.result[0].Ymax
        //     ];
        //     console.log(vm);
        // })
    }]);