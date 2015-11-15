define([
    "text!templates/productsBlock/groupListItemTemplate.js",
    "views/productsBlock/productsListItemView",
  ],
  function (GroupListItemTemplate, ProductListItemView) {


    var GroupListItemView = Mn.LayoutView.extend({
      className: 'nav-sidebar__item menu-group__item',
      tagName: 'li',
      childViewContainer: '.childrenBlock',
      template: GroupListItemTemplate,
      initialize: function (param) {
        var that = this;
        that.groupChildView =  Mn.CollectionView.extend({
          tagName: 'ul',
          childView: GroupListItemView,
          collection: new Backbone.Collection()
        });

        that.productChildView =  Mn.CollectionView.extend({


          tagName: 'ul',
          childView: ProductListItemView,
          collection: new Backbone.Collection()
        });
        if(!that.model)return;
        that.model.on('change', that.render, that);
      },
      onRender: function() {
        var that = this;
        if (that.model.get('children')) {
          if (that.model.get('childrenView') === 'group') {
            that.childrenView = new that.groupChildView();
          } else {
            that.childrenView = new that.productChildView();
          }
          that.childrenView.collection.reset(that.model.get('children'));
          that.childrenRegion.show(that.childrenView);
        }
      },
      regions: {
        childrenRegion: '.childrenBlock'
      }
    });
    return GroupListItemView;
  });