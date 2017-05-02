/**
 * Created by Donny on 17/5/2.
 */
/**
 * Image source base model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(ol.Attribution[]|undefined)} attributes.attributions               - attributions.
 * @property {(ol.CanvasFunctionType|undefined)} attributes.canvasFunction        - canvas function.
 * @property {(string|olx.LogoOptions|undefined)} attributes.logo                 - logo.
 * @property {(ol.proj.ProjectionLike|undefined)} attributes.projection           - projection.
 * @property {(number|undefined)} attributes.ratio                                - canvas to viewport ratio.
 * @property {(number[]|undefined)} attributes.resolutions                        - list of resolutions.
 * @property {(ol.source.State|string|undefined)} attributes.state                -  state.
 */
aol.models.sources.Image = function () {
    aol.models.layers.Layer.apply(this, arguments);
    this.attributes.source = undefined;
    this.attributes.map = undefined;
    this.attributes.preload = undefined;
    this.attributes.useInterimTilesOnError = undefined;
    this.callbacks['change:source'] = undefined;
    this.callbacks['change:preload'] = undefined;
    this.callbacks['change:useInterimTilesOnError'] = undefined;
    this.callbacks['postcompose'] = undefined;
    this.callbacks['precompose'] = undefined;
    this.callbacks['propertychange'] = undefined;
    this.callbacks['render'] = undefined;
};

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
    aol.models.sources.Image.apply(this, arguments);
    this.attributes.params = undefined;
    this.attributes.url = undefined;
    this.attributes.urls = undefined;
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