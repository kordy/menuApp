Marionette.View.prototype.getTemplate = function() {
    return _.template(this.getOption('template'));
};

requirejs.config({
    baseUrl: 'static',
    paths: {
        text: 'js/libs/text',
        views: 'views',
        templates: 'templates',
        models: 'models',
        collections: '/collections'
    }
});

requirejs(["views/layoutView"], function(LayoutView) {
    var layoutView = new LayoutView();
});