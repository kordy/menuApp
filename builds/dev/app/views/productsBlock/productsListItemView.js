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
      bindings: {
        '.prod-name': 'name',
        '.prod-name-eng': 'nameEng',
        '.prod-serving': 'serving',
        '.prod-serving-drink': 'servingDrink',
        '.prod-price-serving': 'priceServing',
        '.prod-price-kg': 'priceKg',
        '.prod-price-base': 'priceBase',
        '.prod-image': 'image'
      },
      template: ProductsListItemTemplate,
      initialize: function (param) {
        var that = this;
        that.model.on('change', that.render, that);
      },
      onRender: function() {
        var that = this;
        this.stickit();
      },
      onDestroy: function() {
        console.log('destroy');
        this.$el.remove();
      },
      showEditPanel: function(e){
        e.stopPropagation();
        var $el = $(this.el);
        $('.panel').hide();
        $el.find('.panel').show();
      }
    });
    return ProductsListItemView;
  });