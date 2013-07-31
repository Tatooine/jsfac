register('barWidgetViewModel', function (eventLog) {
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