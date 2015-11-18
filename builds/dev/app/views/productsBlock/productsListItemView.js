define([
    "text!templates/productsBlock/productsListItemTemplate.js",
    "sync"
  ],
  function (ProductsListItemTemplate, Sync) {
    var ProductsListItemView = Mn.ItemView.extend({
      className: 'prod-group__item',
      tagName: 'li',
      events: {
        'click .glyphicon-edit': 'showEditPanel',
        'click .glyphicon-plus-sign': 'initAddToMenu'
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
      initAddToMenu: function(){
        var that = this;
        Sync.trigger('addToMenu', that.model.attributes);
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