
export function CloseOnSelect() {
}

CloseOnSelect.prototype.bind = function (decorated, container, $container) {
    const self = this;

    decorated.call(this, container, $container);

    container.on('select', function (evt) {
        self._selectTriggered(evt);
    });

    container.on('unselect', function (evt) {
        self._selectTriggered(evt);
    });
};

CloseOnSelect.prototype._selectTriggered = function (_, evt) {
    const { originalEvent } = evt;

    // Don't close if the control key is being held
    if (originalEvent && originalEvent.ctrlKey) {
        return;
    }

    this.trigger('close', {
        originalEvent,
        originalSelect2Event: evt
    });
};
