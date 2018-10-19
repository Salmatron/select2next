import * as $ from 'jquery';

import {CompatUtils} from './utils.js';

// No-op CSS adapter that discards all classes by default
function _containerAdapter(clazz) {
    return null;
}

export function ContainerCSS() {}

ContainerCSS.prototype.render = function (decorated) {
    const $container = decorated.call(this);

    let containerCssClass = this.options.get('containerCssClass') || '';

    if ($.isFunction(containerCssClass)) {
        containerCssClass = containerCssClass(this.$element);
    }

    let containerCssAdapter = this.options.get('adaptContainerCssClass');
    containerCssAdapter = containerCssAdapter || _containerAdapter;

    if (containerCssClass.indexOf(':all:') !== -1) {
        containerCssClass = containerCssClass.replace(':all:', '');

        const _cssAdapter = containerCssAdapter;

        containerCssAdapter = function (clazz) {
            const adapted = _cssAdapter(clazz);

            if (adapted != null) {
                // Append the old one along with the adapted one
                return adapted + ' ' + clazz;
            }

            return clazz;
        };
    }

    let containerCss = this.options.get('containerCss') || {};

    if ($.isFunction(containerCss)) {
        containerCss = containerCss(this.$element);
    }

    CompatUtils.syncCssClasses($container, this.$element, containerCssAdapter);

    $container.css(containerCss);
    $container.addClass(containerCssClass);

    return $container;
};
