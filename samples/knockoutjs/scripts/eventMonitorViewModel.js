register('eventMonitorViewModel', function (eventLog) {
    var m = {
        events: ko.observableArray([])
    };

    eventLog.listen(function (e) {
        m.events.push(e);
    });

    return m;
});