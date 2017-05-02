/**
 * Created by Donny on 17/4/26.
 */
(function () {
    "use strict";

    var prodURL = 'https://**.***.com/',
        devURL = 'http://192.168.99.105:9527/',
        Urls = {
            Prod_Cfg: {
                api: prodURL + 'MapService.svc/',
                img: prodURL
            },
            Dev_Cfg: {
                api: devURL + 'MapService.svc/',
                img: 'http://192.168.99.105:9528/'
            }
        };

    angular.module('mapViewer.config', [])

        .constant('URL_CFG', Urls.Dev_Cfg)

        .constant('APP_VERSION', {
            DEV: '1.0.0',
            RELEASE: '1.0.0'
        })

})();