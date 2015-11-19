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
          handle: '.menuItemHandle',
          containment:'body'
        }
      },
      initialize: function(params) {
        var that = this;
        that.collection = params.collection;
        that.collection.on('removeItem',that.removeItem, that);
      },
      onRender: function() {
        var that = this;
      },
      removeItem: function(model) {
        this.collection.remove(model);
      }
    });
    return MenuProductsView;
  });
