define([
    "text!templates/menuBlockTemplate.js",
    "views/shared/selectView",
    "views/menuBlock/menuProductsView",
    "collections/blanksCollection",
    "collections/menusCollection",
    "models/menuModel",
    "models/model",
    "sync"
  ],
  function(MenuBlockTemplate, SelectView, MenuProductsView, BlanksCollection, MenusCollection, MenuModel, Model, Sync) {
    var MenuBlockView = Marionette.LayoutView.extend({
      template: MenuBlockTemplate,
      model: new MenuModel(),
      regions: {
        savedMenusRegion: '[data-region="savedMenusRegion"]',
        blankSelectRegion: '[data-region="blankSelectRegion"]',
        menuProductsRegion: '[data-region="menuProductsRegion"]'
      },
      events: {
        'change .isEnglish': 'initChangeLanguage'
      },
      bindings: {
        '.noAdditionalExpenses': {
          observe: 'noAdditionalExpenses'
        },
        '.serviceIncrease': {
          observe: 'serviceIncrease'
        },
        '.commentAdditionalExpenses': {
          observe: 'commentAdditionalExpenses'
        },
        '.isEnglish': {
          observe: 'isEnglish'
        },
        '.isImages': {
          observe: 'isImages'
        },
        '.noPrices': {
          observe: 'noPrices'
        },
        '.discount': {
          observe: 'discount'
        }
      },
      initialize: function() {
        var that = this;
        that.blanksCollection = new BlanksCollection();
        that.menusCollection = new MenusCollection();
        that.menusCollection.fetch();
        that.blanksCollection.fetch();
        that.menusCollection.on('sync', function() {

        });
        that.blanksCollection.on('sync', function() {

        });
        Sync.on('addToMenu', that.addProduct, that);
        that.model.items = new Backbone.Collection();
      },
      onRender: function() {
        var that = this;
        var selectMenuView = new SelectView({collection: that.menusCollection});
        selectMenuView.on('change', function(selected) {
          console.log(selected);
          that.setCurrentMenu(selected);
        });
        this.savedMenusRegion.show(selectMenuView);
        var blanksSelectView = new SelectView({collection: that.blanksCollection});
        blanksSelectView.on('change', function(selected) {
          console.log(selected);
        });
        this.blankSelectRegion.show(blanksSelectView);
        this.menuProductsView = new MenuProductsView({collection: that.model.items});
        this.menuProductsRegion.show(this.menuProductsView);
        that.stickit();
      },
      initChangeLanguage: function() {
        var that = this;
        Sync.trigger('changeLanguage', that.model.get('isEnglish'));
      },
      setCurrentMenu: function(selected) {
        //var groups = {};
        //console.log(selected);
        //var products = selected.get('products');
        //console.log(products);
        //_.each(products, function(product) {
        //  if (!groups[product.group[0].name]) groups[product.group[0].name] = [];
        //  groups[product.group[0].name][groups[product.group[0].name].length] = product;
        //});
        //console.log(groups);
      },
      addProduct: function(item) {
        var that = this;
        if (item.code) item.isGroup = true;
        that.model.items.add(new Model(item));
        that.model.set('items', that.model.items.toJSON());
        console.log(that.model);
      }
    });
    return MenuBlockView;
  });