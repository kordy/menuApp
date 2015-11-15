define([
    "text!templates/productsBlock/productsListItemTemplate.js"
  ],
  function (ProductsListItemTemplate) {
    var ProductsListItemView = Mn.ItemView.extend({
      className: 'prod-group__item',
      tagName: 'li',

      template: ProductsListItemTemplate,
      initialize: function (param) {
        var that = this;
//        that.model.on('change', that.render, that);
      },
      onRender: function() {
        var that = this;
      },
    });
    return ProductsListItemView;
  });