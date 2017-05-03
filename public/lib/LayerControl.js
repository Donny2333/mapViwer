/**
 * Created by Donny on 17/5/2.
 */
ol.control.LayerControl = function (opt_options) {
    var options = opt_options ? opt_options : {};

    var className = options.className !== undefined ? options.className :
        'ol-control-layercontrol';

    var element = document.createElement('ul');
    element.className = className;

    var render = options.render || ol.control.LayerControl.render;

    this.layerControlInitialized_ = false;

    ol.control.Control.call(this, {
        element: element,
        render: render,
        target: options.target
    });
};

ol.inherits(ol.control.LayerControl, ol.control.Control);

ol.control.LayerControl.render = function (mapEvent) {
    if (!mapEvent.frameState) {
        return;
    }
    if (!this.layerControlInitialized_) {
        var map = this.getMap(),
            layers = map.getLayers(),
            layer = [],
            layerName = [],
            layerVisibility = [];

        for (var i = 0; i < layers.getLength(); i++) {
            layer[i] = layers.item(i);
            layerName[i] = layer[i].get('name');
            layerVisibility[i] = layer[i].getVisible();

            var li = document.createElement('li');
            li.className = 'ol-layer-item';

            var checkbox = document.createElement('input');
            checkbox.id = layerName[i];
            checkbox.name = 'layer';
            checkbox.type = 'checkbox';
            li.appendChild(checkbox);

            var label = document.createElement('label');
            label.htmlFor = layerName[i];
            setInnerText(label, layerName[i]);
            li.appendChild(label);
            this.element.appendChild(li);

            if (layerVisibility[i]) {
                checkbox.checked = true;
            }
            addChangeEvent(checkbox, layer[i]);
        }

        this.layerControlInitialized_ = true;
    }
};

aol.models.controls.LayerControl = function () {
    aol.models.controls.Control.apply(this, arguments);
    this.attributes.className = undefined;
    this.callbacks['change:source'] = undefined;
    this.callbacks['render'] = undefined;
};

aol.directives.ControlLayerControl = function () {
    aol.Directive.apply(this, arguments);
    this.name = 'aolControlLayercontrol';
    this.require = ['^aolMap'];
    this.replace = true;
    this.instance = ol.control.LayerControl;
    this.model = aol.models.controls.LayerControl;
    this.onParentInstance = function (parentInst, instance) {
        parentInst.addControl(instance);
    };
    this.onDestroy = function (parentInst, instance) {
        parentInst.removeControl(instance);
    };
};

aol.registerDirective(new aol.directives.ControlLayerControl());

function addChangeEvent(element, layer) {
    element.onclick = function () {
        if (element.checked) {
            layer.setVisible(true);
        } else {
            layer.setVisible(false);
        }
    }
}

function setInnerText(element, text) {
    if (typeof element.textContent === 'string') {
        element.textContent = text;
    } else {
        element.innerText = text;
    }
}