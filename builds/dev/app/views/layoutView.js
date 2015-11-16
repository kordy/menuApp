define([
    "text!templates/LayoutTemplate.js",
    "views/productsBlockView",
    "views/menuBlockView"
],
    function(LayoutTemplate, ProductsBlockView, MenuBlockView) {
        var LayoutView = Marionette.LayoutView.extend({
            el: 'body',
            template: LayoutTemplate,
            regions: {
              productsBlockRegion: '#productsBlockRegion',
              menuBlockRegion: '#menuBlockRegion'
            },
            initialize: function() {
                this.render();
            },
            onRender: function() {
                var productsBlockView = new ProductsBlockView();
                this.productsBlockRegion.show(productsBlockView);
                var menuBlockView = new MenuBlockView();
                this.menuBlockRegion.show(menuBlockView);
            }
        });
        return LayoutView;
    });