define([
        "text!templates/productsBlockTemplate.js",
        "views/productsBlock/productsListView",
        "views/productsBlock/blanksTableView",
        "views/productsBlock/hotsTableView",
        "views/productsBlock/excelUploadView",
        "userInfo"
    ],
    function(ProductsBlockTemplate, ProductsTableView, BlanksTableView, HotsTableView, ExcelUploadView, User) {
        var ProductsBlockView = Marionette.LayoutView.extend({
            template: ProductsBlockTemplate,
            templateHelpers: function(){
                return {
                    isAdmin: User.isAdmin()
                }
            },
            regions: function() {
                var regions = {
                    productsTableRegion: '[data-region="productsTableRegion"]',
                    blanksTableRegion: '[data-region="blanksTableRegion"]',
                    hotsTableRegion: '[data-region="hotsTableRegion"]'
                };
                if (User.isAdmin()) {
                    regions.excelUploadRegion = '[data-region="excelUploadRegion"]'
                }
                return regions;
            },
            onRender: function() {
                var productsTableView = new ProductsTableView();
                this.productsTableRegion.show(productsTableView);
                var blanksTableView = new BlanksTableView();
                this.blanksTableRegion.show(blanksTableView);
                var hotsTableView = new HotsTableView();
                this.hotsTableRegion.show(hotsTableView);
                if (User.isAdmin()) {
                    var excelUploadView = new ExcelUploadView();
                    this.excelUploadRegion.show(excelUploadView);
                }
            }
        });
        return ProductsBlockView;
    });