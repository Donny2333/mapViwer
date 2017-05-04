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
    this.updateElement_(mapEvent.frameState);
};

ol.control.LayerControl.handleSourceChanged_ = function (event) {
    event.preventDefault();
    this.layerControlInitialized_ = false;
};

ol.control.LayerControl.prototype.updateElement_ = function (frameState) {
    if (!frameState) {
        return;
    }
    if (!this.layerControlInitialized_) {
        var map = this.getMap(),
            layers = map.getLayers(),
            layer = [],
            layerName = [],
            layerVisibility = [];

        this.element.innerHTML = '';
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
            ol.events.listen(layer[i],
                ol.Object.getChangeEventType('source'),
                ol.control.LayerControl.handleSourceChanged_, this);
        }

        this.layerControlInitialized_ = true;
    }
};

ol.control.LayerControl.Property_ = {
    SOURCE: 'source'
};

aol.models.controls.LayerControl = function () {
    aol.models.controls.Control.apply(this, arguments);
    this.attributes.className = undefined;
    this.callbacks['change:source'] = undefined;
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