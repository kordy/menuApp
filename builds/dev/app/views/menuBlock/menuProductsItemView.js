define([
    "text!templates/menuBlock/menuProductsItemTemplate.js",
    "sync"
],
  function (MenuProductsItemTemplate, Sync) {

    var MenuProductsItemView = Mn.ItemView.extend({
      className: 'menu-list__item',
      tagName: 'li',
      template: MenuProductsItemTemplate,
      initialize: function () {
        var that = this;
        Sync.on('changeLanguage', that.changeLanguage, that);
        //var that = this;
        //that.model.set('nameDefault', that.model.get('name'));
      },
      events: {
        'click .menuItemDelete': 'deleteItem'
      },
      bindings: {
        ':el': {
          classes: {
            'menu-list__item--group': 'isGroup'
          }
        },
        '.itemName':{
          observe:'name'
        },
        '.itemMeasure':'measure',
        '.itemPrice':'price',
        '.itemPriceBase':'priceBase',
      },
      changeLanguage: function(isEnglish) {
        var that = this;
        that.model.set('isEnglish', isEnglish);
      },
      onRender: function() {
        console.log(this.model);
        this.stickit();
      },
      deleteItem: function() {
        var that = this;
        that.model.trigger('removeItem', that.model);
      }
    });
    return MenuProductsItemView;
  });
