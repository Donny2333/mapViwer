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
                            'LAYERS': 'show:' + (layerId || -1)
                        });
                    }, 300)
                }
            },
            popup: {},
            contents: {
                id: 0,
                data: []
            }
        };


        // 1. query map url by ID
        var url = document.getElementById('vm.url').value;


        // 2. get information of the map
        var url1 = 'http://192.168.100.5:6080/arcgis/rest/services/IndustryMaps2/01_aqssfbt/MapServer';
        var url2 = 'http://192.168.99.82:6080/arcgis/rest/services/MyMapService/MapServer';
        var url3 = 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/';

        // var url = url1;
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

        var overlay = new ol.Overlay({
            element: container,
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        });

        $compile(container)($scope);

        $scope.swipe = function (delta) {
            var contents = vm.contents.data;
            var id = (vm.contents.id += delta);
            vm.popup.layerName = contents[id].layerName;
            vm.popup.attribute = contents[id].attributes;
            return false;
        };

        $scope.close = function () {
            overlay.setPosition(undefined);
            closer.blur();
            return false;
        };

        var map = new ol.Map({
            layers: [new ol.layer.Image()],
            overlays: [overlay],
            target: 'map',
            view: new ol.View({
                center: [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2],
                // zoom: 15,
                extent: extent,
                resolution: 96
            })
        });


        // 4. add popup event and controls
        map.on('singleclick', function (evt) {
            var coordinate = evt.coordinate;
            var x = coordinate[0];
            var y = coordinate[1];

            Map.identify(url, {
                geometry: [x - .00005, y - .00005, x + .00005, y + .00005].join(','),
                geometryType: "esriGeometryEnvelope",
                layers: 'all',
                tolerance: 10,
                sr: '3857',
                mapExtent: map.getView().calculateExtent(),
                imageDisplay: _.union(map.getSize(), [map.getView().getResolution()]),
                f: "json"
            }).then(function (res) {
                if (res.status === 200 && res.data && res.data.results && res.data.results.length) {
                    var contents = vm.contents.data = res.data.results;
                    var id = vm.contents.id = 0;
                    vm.popup.layerName = contents[id].layerName;
                    vm.popup.attribute = contents[id].attributes;

                    var html = "<div ng-include=\"'popup-content.html'\"></div>";
                    content.innerHTML = '';
                    $compile(html)($scope).appendTo(content);
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
    }]);