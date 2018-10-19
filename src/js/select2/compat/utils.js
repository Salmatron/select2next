import * as $ from 'jquery';

function syncCssClasses($dest, $src, adapter) {
    let classes, replacements = [], adapted;

    classes = $.trim($dest.attr('class'));

    if (classes) {
        classes = String(classes); // for IE which returns object

        $(classes.split(/\s+/)).each(function () {
            // Save all Select2 classes
            if (this.indexOf('select2-') === 0) {
                replacements.push(this);
            }
        });
    }

    classes = $.trim($src.attr('class'));

    if (classes) {
        classes = String(classes); // for IE which returns object

        $(classes.split(/\s+/)).each(function () {
            // Only adapt non-Select2 classes
            if (this.indexOf('select2-') !== 0) {
                adapted = adapter(this);

                if (adapted != null) {
                    replacements.push(adapted);
                }
            }
        });
    }

    $dest.attr('class', replacements.join(' '));
}

export const CompatUtils = {
    syncCssClasses
};
