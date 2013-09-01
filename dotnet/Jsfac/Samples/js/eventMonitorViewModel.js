jsfac.module('dashboard', ['diagnostics'], function (register) {

    register('eventMonitorViewModel', ['eventLog'], function (eventLog) {
        var m = {
            events: ko.observableArray([])
        };

        eventLog.listen(function (e) {
            m.events.push(e);
        });

        return m;
    });

});

