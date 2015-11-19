define([
    "text!templates/menuBlockTemplate.js",
    "views/shared/selectView",
    "views/menuBlock/menuProductsView",
    "collections/blanksCollection",
    "collections/menusCollection",
    "models/menuModel",
    "models/productModel",
    "sync"
  ],
  function(MenuBlockTemplate, SelectView, MenuProductsView, BlanksCollection, MenusCollection, MenuModel, ProductModel, Sync) {
    var MenuBlockView = Marionette.LayoutView.extend({
      template: MenuBlockTemplate,
      regions: {
        savedMenusRegion: '[data-region="savedMenusRegion"]',
        blankSelectRegion: '[data-region="blankSelectRegion"]',
        menuProductsRegion: '[data-region="menuProductsRegion"]'
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
        that.currentMenu = new MenuModel();
        that.currentMenu.items = new Backbone.Collection();
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
        this.menuProductsView = new MenuProductsView({collection: that.currentMenu.items});
        this.menuProductsRegion.show(this.menuProductsView);

      },
      setCurrentMenu: function(selected) {
        var groups = {};
        console.log(selected);
        var products = selected.get('products');
        console.log(products);
        _.each(products, function(product) {
          if (!groups[product.group[0].name]) groups[product.group[0].name] = [];
          groups[product.group[0].name][groups[product.group[0].name].length] = product;
        });
        console.log(groups);
      },
      addProduct: function(product) {
        var that = this;
        //console.log(that);
        //console.log(that.currentMenu);
        that.currentMenu.items.add(new ProductModel(product));
        console.log(that.currentMenu.items);
        //that.currentMenu.set('products', that.currentMenu.products);
        //console.log(that.currentMenu);
      }
    });
    return MenuBlockView;
  });