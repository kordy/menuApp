define([
    "text!templates/menuBlock/menuProductsTemplate.js",
    "views/menuBlock/menuProductsItemView",
    "collections/menusCollection",
    "behaviors/sortableBehavior"
  ],
  function(MenuProductsTemplate, MenuProductsListItemView, MenusCollection, SortableBehavior) {

    var MenuProductsView = Marionette.CompositeView.extend({
      template: MenuProductsTemplate,
      childView: MenuProductsListItemView,
      childViewContainer: '[data-region="menuProductsItemsRegion"]',
      behaviors: {
        SortableBehavior:{
          behaviorClass: SortableBehavior,
          el: '[data-region="menuProductsItemsRegion"]',
          containment:'body'
        }
      },
      initialize: function(params) {
        var that = this;
        that.collection = params.collection;

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
        //var menuProductsListItemView = new MenuProductsListItemView();
        //that.menuProductsItemsRegion.show(menuProductsListItemView);
      }
    });
    return MenuProductsView;
  });
