/**
 * Created by Donny on 17/5/2.
 */
angular.module('mapViewer', [
    aol.moduleName,
    'mapViewer.config',
    'mapViewer.service',
    'mapViewer.directive'
])
    .controller('AppController', ['$scope', '$timeout', '$http', 'Gallery', function ($scope, $timeout, $http, Gallery) {
        var vm = $scope.vm = {
            list: [],
            setting: {
                check: {
                    enable: true
                },
                data: {
                    key: {
                        title: "name",
                        checked: "defaultVisibility"
                    },
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "parentLayerId",
                        rootPId: -1
                    }
                },
                callback: {
                    onClick: function (event, treeId, treeNode, clickFlag) {
                        console.log(treeNode);
                    }
                }
            }
        };


        // 1. query map url by ID
        var id = document.getElementById('vm.id').value;


        // 2. get information of the map
        var url1 = 'http://192.168.100.5:6080/arcgis/rest/services/IndustryMaps2/01_aqssfbt/MapServer';
        var url2 = 'http://192.168.99.82:6080/arcgis/rest/services/MyMapService/MapServer';
        var url3 = 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/';

        var url = url1;
        var params = {
            f: 'pjson'
        };

        var extent = [12426884.777, 3812409.2678, 12433705.749, 3815674.2327];
        var pjson = {};

        $http.get(ol.uri.appendParams(url, params)).then(function (res) {
            if (res.status === 200 && res.data) {
                pjson = res.data;
                vm.list = pjson.layers;

                console.log(vm.list);
            }
        });

        // $http.get('/json/layers.json').then(function (res) {
        //     vm.list = res.data.layers;
        //
        //     console.log(vm.list);
        // });


        // 3. create map
        var layer = new ol.layer.Image({
            source: new ol.source.ImageArcGISRest({
                url: url,
                params: {
                    // 'LAYERS': '0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33'
                }
            })
        });

        var map = new ol.Map({
            layers: [layer],
            target: 'map',
            view: new ol.View({
                center: [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2],
                // zoom: 15,
                extent: extent,
                resolution: 96
            })
        });

        // remove Attribution control
        map.getControls().forEach(function (control) {
            if (control instanceof ol.control.Attribution) {
                map.getControls().remove(control);
            }
        });

        // add zoomSlider control
        var zoomslider = new ol.control.ZoomSlider();
        map.addControl(zoomslider);

        // add scaleLine control
        var scaleLine = new ol.control.ScaleLine({
            units: 'metric'
        });
        map.addControl(scaleLine);

        // $http.get(url2 + '?f=pjson').then(function (res) {
        //     vm.extent = [
        //         res.data.fullExtent.xmin,
        //         res.data.fullExtent.ymin,
        //         res.data.fullExtent.xmax,
        //         res.data.fullExtent.ymax
        //     ];
        // })

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