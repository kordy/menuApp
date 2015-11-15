define([
    "text!templates/productsBlock/productsListItemTemplate.js"
  ],
  function (ProductsListItemTemplate) {
    var ProductsListItemView = Mn.ItemView.extend({
      className: 'prod-group__item',
      tagName: 'li',
      events: {
        'click .glyphicon-edit': 'showEditPanel'
      },
      template: ProductsListItemTemplate,
      initialize: function (param) {
        var that = this;
//        that.model.on('change', that.render, that);
      },
      onRender: function() {
        var that = this;
      },
      showEditPanel: function(e){
        e.stopPropagation();
        var $el = $(this.el);
        $el.find('.panel').show();
        $el.siblings().find('.panel').hide();
      }
    });
    return ProductsListItemView;
  });