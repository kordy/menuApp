define([
    "text!templates/menuBlockTemplate.js",
    "views/shared/selectView",
    "views/menuBlock/menuProductsView",
    "collections/blanksCollection",
    "collections/menusCollection"
  ],
  function(MenuBlockTemplate, SelectView, MenuProductsView, BlanksCollection, MenusCollection) {
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
      },
      onRender: function() {
        var that = this;
        var selectMenuView = new SelectView({collection: that.menusCollection});
        selectMenuView.on('change', function(selected) {
          console.log(selected);
        });
        this.savedMenusRegion.show(selectMenuView);
        var blanksSelectView = new SelectView({collection: that.blanksCollection});
        blanksSelectView.on('change', function(selected) {
          console.log(selected);
        });
        this.blankSelectRegion.show(blanksSelectView);
        this.menuProductsView = new MenuProductsView();
        this.menuProductsRegion.show(this.menuProductsView);

      }
    });
    return MenuBlockView;
  });