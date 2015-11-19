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
        //console.log(this);
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
        }
      },
      changeLanguage: function(isEnglish) {
        var that = this;
        that.model.set('isEnglish', isEnglish);
      },
      onRender: function() {
        this.stickit();
      },
      deleteItem: function() {
        var that = this;
        that.model.trigger('removeItem', that.model);
      }
    });
    return MenuProductsItemView;
  });
