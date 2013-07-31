register('main', function (fooWidgetViewModel, barWidgetViewModel, eventMonitorViewModel) {
    return {
        foo: fooWidgetViewModel,
        bar: barWidgetViewModel,
        monitor: eventMonitorViewModel
    };
});

ko.applyBindings(resolve('main'));