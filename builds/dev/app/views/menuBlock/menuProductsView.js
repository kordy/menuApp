define([
    "text!templates/menuBlock/menuProductsTemplate.js",
  ],
  function(MenuProductsTemplate) {
    var MenuProductsView = Marionette.LayoutView.extend({
      template: MenuProductsTemplate,
      regions: {
        //savedMenusRegion: '[data-region="savedMenusRegion"]',
        //blankSelectRegion: '[data-region="blankSelectRegion"]'
      },
      initialize: function() {
        var that = this;
        //that.blanksCollection = new BlanksCollection();
        //that.menusCollection = new MenusCollection();
        //that.menusCollection.fetch();
        //that.blanksCollection.fetch();

      },
      onRender: function() {
      //  var that = this;
      //  var selectMenuView = new SelectView({collection: that.menusCollection});
      //  selectMenuView.on('change', function(selected) {
      //    console.log(selected);
      //  });
      //  this.savedMenusRegion.show(selectMenuView);
      //  var blanksSelectView = new SelectView({collection: that.blanksCollection});
      //  blanksSelectView.on('change', function(selected) {
      //    console.log(selected);
      //  });
      //  this.blankSelectRegion.show(blanksSelectView);
      }
    });
    return MenuProductsView;
  });
