define([
        "text!templates/productsBlock/excelUploadTemplate.js"
    ],
    function(ExcelUploadTemplate) {
        var ExcelUploadView = Marionette.LayoutView.extend({
            className: 'highlight',
            template: ExcelUploadTemplate,
            initialize: function() {
                this.render();
            }
        });
        return ExcelUploadView;
    });