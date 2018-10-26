
function syncCssClasses($dest, $src, adapter) {
    let classes, replacements = [], adapted;

    classes = ($dest.attr('class') != null) ? String($dest.attr('class')).trim() : null;

    if (classes) {
        $(classes.split(/\s+/)).each(function () {
            // Save all Select2 classes
            if (this.indexOf('select2-') === 0) {
                replacements.push(this);
            }
        });
    }

    classes = ($src.attr('class') != null) ? String($src.attr('class')).trim() : null;

    if (classes) {
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
