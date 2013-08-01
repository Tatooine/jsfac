jsfac.module('dashboard', ['diagnostics'], function (register) {

    register('barWidgetViewModel', ['eventLog'], function (eventLog) {
        var count = 0;
        return {
            click: function () {
                eventLog.log({
                    source: 'barWidget',
                    message: 'Click ' + ++count + ' on fooWidgetViewModel'
                });
            }
        };
    });

});
