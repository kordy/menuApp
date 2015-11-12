define([
        "text!templates/productsBlock/productsTableTemplate.js"
    ],
    function(ProductsBlockTemplate) {
        console.log(ProductsBlockTemplate);
        var ProductsTableView = Marionette.LayoutView.extend({
            className: 'highlight',
            template: ProductsBlockTemplate,
            initialize: function() {
                this.render();
            }
        });
        return ProductsTableView;
    });