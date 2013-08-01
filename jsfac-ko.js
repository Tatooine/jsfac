$(function () {
    $('[data-jsfac-ko]').each(function (i, e) {
        var config = $(e).data('jsfac-ko');
        ko.applyBindings(jsfac.resolve(config.module, config.viewModel), e);
    });
});
