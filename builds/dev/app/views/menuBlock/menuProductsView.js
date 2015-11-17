define([
    "text!templates/menuBlock/menuProductsTemplate.js",
    "views/menuBlock/menuProductsItemView",
    "collections/menusCollection"
  ],
  function(MenuProductsTemplate, MenuProductsListItemView, MenusCollection) {
    var MenuProductsView = Marionette.LayoutView.extend({
      template: MenuProductsTemplate,
      regions: {
        menuProductsItemsRegion: '[data-region="menuProductsItemsRegion"]',
      },
      initialize: function() {
        var that = this;
        //that.blanksCollection = new BlanksCollection();
        //that.menusCollection = new MenusCollection();
        //that.menusCollection.fetch();
        //that.blanksCollection.fetch();

      },
      onRender: function() {
        var that = this;
        //this.$el = this.$el.children();
        //that.$el.unwrap();
      //  var selectMenuView = new SelectView({collection: that.menusCollection});
      //  selectMenuView.on('change', function(selected) {
      //    console.log(selected);
      //  });
      //  this.savedMenusRegion.show(selectMenuView);
      //  that.menusCollection = new MenusCollection();
        //that.menusCollection.fetch();
        var menuProductsListItemView = new MenuProductsListItemView();
        that.menuProductsItemsRegion.show(menuProductsListItemView);
      }
    });
    return MenuProductsView;
  });
