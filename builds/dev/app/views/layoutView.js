define([
    "text!templates/layoutTemplate.js",
    "views/productsBlockView"
],
    function(LayoutTemplate, ProductsBlockView) {
        var LayoutView = Marionette.LayoutView.extend({
            el: 'body',
            template: LayoutTemplate,
            regions: {
                productsBlockRegion: '#productsBlockRegion'
            },
            initialize: function() {
                console.log('herre');
                this.render();
            },
            onRender: function() {
                var productsBlockView = new ProductsBlockView();
                this.productsBlockRegion.show(productsBlockView);
            }
        });
        return LayoutView;
    });