/**
 * Created by Donny on 17/5/2.
 */

/**
 * ImageArcGISRest source model class
 *
 * @class
 * @augments aol.models.sources.TileImage
 * @property {(Object.<string,string>|undefined)} attributes.params      - params passed to the server.
 * @property {(string|undefined)} attributes.url                         - ArcGIS Rest service URL.
 * @property {(string[]|undefined)} attributes.urls                      - ArcGIS Rest service urls.
 */
aol.models.sources.ImageArcGISRest = function () {
    aol.models.Model.apply(this, arguments);
    this.attributes.params = undefined;
    this.attributes.url = undefined;
    this.watchers['url'] = function (newValue, oldValue, scope, instanceController, parentController) {
        instanceController.getPromise().then(function (instance) {
            instance.setUrl(newValue);
        });

        // dispatch event to layer that source has been changed.
        parentController.getPromise().then(function (instance) {
            instance.dispatchEvent('change:source');
        });
    }
};

/**
 * ImageArcGISRest source directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.SourceImageArcGISRest = function () {
    aol.Directive.apply(this, arguments);
    this.name = 'aolSourceImagearcgisrest';
    this.require = ['^aolLayerImage'];
    this.replace = true;
    this.instance = ol.source.ImageArcGISRest;
    this.model = aol.models.sources.ImageArcGISRest;
    this.onParentController = function (parentCtrl, instance) {
        parentCtrl.setSource(instance);
    };
};

aol.registerDirective(new aol.directives.SourceImageArcGISRest());