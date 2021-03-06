
export function EventRelay() {
}

EventRelay.prototype.bind = function (decorated, container, $container) {
    const self = this;
    const relayEvents = [
        'open', 'opening',
        'close', 'closing',
        'select', 'selecting',
        'unselect', 'unselecting',
        'clear', 'clearing'
    ];

    const preventableEvents = [
        'opening', 'closing', 'selecting', 'unselecting', 'clearing'
    ];

    decorated.call(this, container, $container);

    container.on('*', function (name, params) {
        // Ignore events that should not be relayed
        if (relayEvents.indexOf(name) === -1) {
            return;
        }

        // The parameters should always be an object
        params = params || {};

        // Generate the jQuery event for the Select2 event
        const evt = $.Event(`select2:${name}`, {
            params
        });

        self.$element.trigger(evt);

        // Only handle preventable events if it was one
        if (preventableEvents.indexOf(name) === -1) {
            return;
        }

        params.prevented = evt.isDefaultPrevented();
    });
};

