/**
 * Created by Donny on 17/5/8.
 */
angular.module('mapViewer.directive', [])
    .directive('zTree', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var treeObj = undefined;
                var setting = $parse(attrs.setting)(scope);
                var zNodes = $parse(attrs.zNodes)(scope);

                treeObj = $.fn.zTree.init(element, setting, zNodes);

                scope.$watch(function () {
                    return $parse(attrs.zNodes)(scope);
                }, function (value) {
                    if (value) {
                        treeObj = $.fn.zTree.init(element, setting, value);
                    }
                });
            }
        }
    }])