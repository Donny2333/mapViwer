/**
 * Created by Donny on 17/5/2.
 */
angular.module('mapViewer', [
    aol.moduleName,
    'mapViewer.config',
    'mapViewer.service',
    'mapViewer.directive'
])
    .controller('AppController', ['$scope', '$timeout', '$http', '$compile', 'Gallery', 'Map', 'URL_CFG', function ($scope, $timeout, $http, $compile, Gallery, Map, URL_CFG) {
        var map = null;
        var url;
        var Xmin;
        var Ymin;
        var Xmax;
        var Ymax;
        var srcID;
        var extent = [];
        var pjson = {};
        var id = _.last(_.split(window.location.pathname, '/'));
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

        function initMap(url, params) {
            map.getLayers().item(0).setSource(new ol.source.ImageArcGISRest({
                url: url,
                params: params || {}
            }));
        }


        // 1. query map url by ID
        $http.post(URL_CFG.api + 'GetMapDocList', {
            docID: id,
            pageNo: 0,
            pageNum: 10
        }).then(function (res) {
            if (res.data.status === 'ok') {

                // 2. get information of the map
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
                url = res.data.result[0].MapServerPath;
                Xmin = parseFloat(res.data.result[0].Xmin);
                Ymin = parseFloat(res.data.result[0].Ymin);
                Xmax = parseFloat(res.data.result[0].Xmax);
                Ymax = parseFloat(res.data.result[0].Ymax);
                extent = [Xmin, Ymin, Xmax, Ymax];
                srcID = res.data.result[0].SrcID;

                // 3. create the map
                map = new ol.Map({
                    layers: [new ol.layer.Image()],
                    overlays: [overlay],
                    target: 'map',
                    view: new ol.View({
                        center: [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2],
                        // zoom: 15,
                        extent: extent,
                        projection: new ol.proj.Projection({
                            code: 'EPSG:' + srcID,
                            // set projection's units
                            units: extent[0] < 150 && extent[0] > 50 ? 'degrees' : 'm'
                        })
                    })
                });

                // set map's resolution
                var size = map.getSize();
                var resolution = (extent[3] - extent[1]) / size[1];
                map.getView().setResolution(resolution);

                Map.load(url, {
                    f: 'pjson'
                }).then(function (res) {
                    if (res.status === 200 && res.data) {
                        pjson = res.data;
                        vm.list = pjson.layers;
                        initMap(url);
                    }
                });

                // 4. add popup event and other controls
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

                map.on('singleclick', function (evt) {
                    var coordinate = evt.coordinate;
                    var x = coordinate[0];
                    var y = coordinate[1];

                    Map.identify(url, {
                        geometry: [x - .00005, y - .00005, x + .00005, y + .00005].join(','),
                        geometryType: "esriGeometryEnvelope",
                        layers: 'all',
                        tolerance: 10,
                        sr: srcID,
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
                    units: extent[0] < 150 && extent[0] > 50 ? 'degrees' : 'metric'
                });
                map.addControl(scaleLine);
            }
        });
    }]);