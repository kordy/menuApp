define([
        "text!templates/productsBlockTemplate.js",
        "views/productsBlock/productsTableView",
        "views/productsBlock/blanksTableView",
        "views/productsBlock/excelUploadView"
    ],
    function(ProductsBlockTemplate, ProductsTableView, BlanksTableView, ExcelUploadView) {
        var ProductsBlockView = Marionette.LayoutView.extend({
            template: ProductsBlockTemplate,
            regions: {
                productsTableRegion: '[data-region="productsTableRegion"]',
                blanksTableRegion: '[data-region="blanksTableRegion"]',
                excelUploadRegion: '[data-region="excelUploadRegion"]'
            },
            initialize: function() {
                this.render();
            },
            onRender: function() {
                var productsTableView = new ProductsTableView();
                this.productsTableRegion.show(productsTableView);
                var blanksTableView = new BlanksTableView();
                this.blanksTableRegion.show(blanksTableView);
                var excelUploadView = new ExcelUploadView();
                this.excelUploadRegion.show(excelUploadView);
            }
        });
        return ProductsBlockView;
    });