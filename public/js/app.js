/**
 * Created by Donny on 17/5/2.
 */
angular.module('mapViewer', [
    aol.moduleName,
    'mapViewer.config',
    'mapViewer.service',
    'mapViewer.directive'
])
    .controller('AppController', ['$scope', '$timeout', '$http', '$compile', 'Gallery', 'Map', function ($scope, $timeout, $http, $compile, Gallery, Map) {
        var vm = $scope.vm = {
            list: [],
            setting: {
                check: {
                    enable: true,
                    autoCheckTrigger: true
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
                    onClick: function (treeNode, expandFlag, sonSign, focus, callbackFlag) {
                        var treeObj = $.fn.zTree.getZTreeObj("tree");
                        var nodes = treeObj.getSelectedNodes();
                        if (nodes.length > 0) {
                            treeObj.expandNode(nodes[0], true, false, true);
                        }
                    },
                    onCheck: _.debounce(function (event, treeId, treeNode, clickFlag) {
                        var treeObj = $.fn.zTree.getZTreeObj(treeId);
                        var nodes = treeObj.getCheckedNodes();
                        var layerId = _.join(_.map(nodes, 'id'), ',');

                        initMap(url, {
                            'LAYERS': 'show:' + layerId
                        });
                    }, 300)
                }
            },
            popup: {}
        };


        // 1. query map url by ID
        var id = document.getElementById('vm.id').value;


        // 2. get information of the map
        var url1 = 'http://192.168.100.5:6080/arcgis/rest/services/IndustryMaps2/01_aqssfbt/MapServer';
        var url2 = 'http://192.168.99.82:6080/arcgis/rest/services/MyMapService/MapServer';
        var url3 = 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/';

        var url = url1;

        var extent = [12426884.777, 3812409.2678, 12433705.749, 3815674.2327];
        var pjson = {};


        Map.load(url, {
            f: 'pjson'
        }).then(function (res) {
            if (res.status === 200 && res.data) {
                pjson = res.data;
                vm.list = pjson.layers;
                initMap(url);
            }
        });


        // 3. create map
        var container = document.getElementById('popup');
        var content = document.getElementById('popup-content');
        var closer = document.getElementById('popup-closer');

        var overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
            element: container,
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        }));

        closer.onclick = function () {
            overlay.setPosition(undefined);
            closer.blur();
            return false;
        };

        var map = new ol.Map({
            layers: [new ol.layer.Image({
                // source: new ol.source.ImageArcGISRest({
                //     url: url,
                //     params: {
                //         'LAYERS': '0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33'
                //     }
                // })
            })],
            overlays: [overlay],
            target: 'map',
            view: new ol.View({
                center: [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2],
                // zoom: 15,
                extent: extent,
                resolution: 96
            })
        });

        map.on('singleclick', function (evt) {
            var coordinate = evt.coordinate;
            var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
                coordinate, 'EPSG:3857', 'EPSG:4326'));

            var x = coordinate[0];
            var y = coordinate[1];

            Map.Identify(url, {
                geometry: [x - .00005, y - .00005, x + .00005, y + .00005].join(','),
                geometryType: "esriGeometryEnvelope",
                tolerance: 10,
                sr: '3857',
                mapExtent: map.getView().calculateExtent(),
                imageDisplay: _.union(map.getSize(), [map.getView().getResolution()]),
                f: "json"
            }).then(function (res) {
                if (res.status === 200 && res.data && res.data.results.length) {
                    vm.popup = res.data.results[0].attributes;
                    var html = "<div ng-include=\"'popup-content.html'\"></div>";
                    var complie = $compile(html);
                    var $dom = complie($scope);
                    content.innerHTML = '';
                    $dom.appendTo(content);
                    overlay.setPosition(coordinate);
                }
            });
        });

        function initMap(url, params) {
            map.getLayers().item(0).setSource(new ol.source.ImageArcGISRest({
                url: url,
                params: params || {}
            }));
        }

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