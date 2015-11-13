define([
        "text!templates/productsBlock/productsTableTemplate.js"
    ],
    function(ProductsBlockTemplate) {
        var ProductsTableView = Marionette.LayoutView.extend({
            className: 'highlight',
            template: ProductsBlockTemplate,
            initialize: function() {
                console.log('here');
                  $.ajax({
                      url: 'http://localhost:3000/products'
                  })
                    .done(function(data, statusStr, xhr) {

                    })
                    .fail(function(xhr) {

                    });

                $.ajax({
                    url: 'http://localhost:3000/groups'
                })
                  .done(function(data, statusStr, xhr) {

                  })
                  .fail(function(xhr) {

                  });
                this.render();
            }
        });
        return ProductsTableView;
    });