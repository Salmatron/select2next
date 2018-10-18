import * as $ from '../../../../vendor/jquery-2.1.0.js';
import {CompatUtils} from './utils.js';

// No-op CSS adapter that discards all classes by default
function _containerAdapter(clazz) {
  return null;
}

export function ContainerCSS() {}

ContainerCSS.prototype.render = function (decorated) {
  var $container = decorated.call(this);

  var containerCssClass = this.options.get('containerCssClass') || '';

  if ($.isFunction(containerCssClass)) {
    containerCssClass = containerCssClass(this.$element);
  }

  var containerCssAdapter = this.options.get('adaptContainerCssClass');
  containerCssAdapter = containerCssAdapter || _containerAdapter;

  if (containerCssClass.indexOf(':all:') !== -1) {
    containerCssClass = containerCssClass.replace(':all:', '');

    var _cssAdapter = containerCssAdapter;

    containerCssAdapter = function (clazz) {
      var adapted = _cssAdapter(clazz);

      if (adapted != null) {
        // Append the old one along with the adapted one
        return adapted + ' ' + clazz;
      }

      return clazz;
    };
  }

  var containerCss = this.options.get('containerCss') || {};

  if ($.isFunction(containerCss)) {
    containerCss = containerCss(this.$element);
  }

  CompatUtils.syncCssClasses($container, this.$element, containerCssAdapter);

  $container.css(containerCss);
  $container.addClass(containerCssClass);

  return $container;
};
