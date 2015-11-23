define([
    "text!templates/productsBlock/productsListItemTemplate.js",
    "sync",
    "userInfo"
  ],
  function (ProductsListItemTemplate, Sync, User) {
    var ProductsListItemView = Mn.ItemView.extend({
      className: 'prod-group__item',
      tagName: 'li',
      events: {
        'click .glyphicon-edit': 'showEditPanel',
        'click .glyphicon-plus-sign': 'initAddToMenu'
      },
      bindings: {
        '.prod-name': {
          observe: 'name',
          attributes: [{
            name: 'readonly',
            observe: 'isAdmin',
            onGet: function(value) {
              return !value;
            }
          }]
        },
        '.prod-name-eng': {
          observe: 'nameEng',
          attributes: [{
            name: 'readonly',
            observe: 'isAdmin',
            onGet: function(value) {
              return !value;
            }
          }]
        },
        '.prod-serving': {
          observe: 'serving',
          attributes: [{
            name: 'readonly',
            observe: 'isAdmin',
            onGet: function(value) {
              return !value;
            }
          }]
        },
        '.prod-serving-drink': {
          observe: 'servingDrink',
          attributes: [{
            name: 'readonly',
            observe: 'isAdmin',
            onGet: function(value) {
              return !value;
            }
          }]
        },
        '.prod-price-serving': {
          observe: 'priceServing',
          attributes: [{
            name: 'readonly',
            observe: 'isAdmin',
            onGet: function(value) {
              return !value;
            }
          }]
        },
        '.prod-price-kg': {
          observe: 'priceKg',
          attributes: [{
            name: 'readonly',
            observe: 'isAdmin',
            onGet: function(value) {
              return !value;
            }
          }]
        },
        '.prod-price-base': {
          observe: 'priceBase',
          attributes: [{
            name: 'readonly',
            observe: 'isAdmin',
            onGet: function(value) {
              return !value;
            }
          }]
        },
        '.prod-image': {
          observe: 'image',
          attributes: [{
            name: 'readonly',
            observe: 'isAdmin',
            onGet: function(value) {
              return !value;
            }
          }]
        }
      },
      template: ProductsListItemTemplate,
      initialize: function (param) {
        var that = this;
        that.model.set('isAdmin', User.isAdmin());
        that.model.on('change', that.render, that);
      },
      onRender: function () {
        var that = this;
        this.stickit();
      },
      onDestroy: function () {
        console.log('destroy');
        this.$el.remove();
      },
      initAddToMenu: function () {
        var that = this;
        Sync.trigger('addToMenu', that.model.attributes);
      },
      showEditPanel: function (e) {
        var $el = $(this.el);
        e.stopPropagation();
        $('.nav-sidebar').find('.panel').hide();
        if (!$el.hasClass('prod-current')) $el.addClass('prod-current').find('.panel').show();
        else $el.removeClass('prod-current');
      }
    });
    return ProductsListItemView;
  });