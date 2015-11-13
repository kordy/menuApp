Marionette.View.prototype.getTemplate = function() {
    return _.template(this.getOption('template'));
};

requirejs.config({
    baseUrl: 'static',
    paths: {
        text: 'js/libs/text',
        api: 'services/api'
    }
});

requirejs(["views/layoutView"], function(LayoutView) {
    var layoutView = new LayoutView();
});