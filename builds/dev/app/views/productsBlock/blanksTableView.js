define([
        "text!templates/productsBlock/blanksTableTemplate.js"
    ],
    function(BlanksTableTemplate) {
        var BlanksTableView = Marionette.LayoutView.extend({
            className: 'highlight imageBlock',
            template: BlanksTableTemplate,
            initialize: function() {
                this.render();
            }
        });
        return BlanksTableView;
    });