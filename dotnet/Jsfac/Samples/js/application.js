jsfac.module('application', ['dashboard', 'diagnostics'], function (register) {

    register('main', ['fooWidgetViewModel', 'barWidgetViewModel', 'eventMonitorViewModel'],
        function (fooWidgetViewModel, barWidgetViewModel, eventMonitorViewModel) {
        return {
            foo: fooWidgetViewModel,
            bar: barWidgetViewModel,
            monitor: eventMonitorViewModel
        };
    });

});