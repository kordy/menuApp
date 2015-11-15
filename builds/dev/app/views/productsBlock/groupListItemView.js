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
      events: {
        'click' : 'setActiveMenuItem'
      },
      initialize: function (param) {
        var that = this;
        that.groupChildView =  Mn.CollectionView.extend({
          tagName: 'ul',
          className: 'menu-group',
          childView: GroupListItemView,
          collection: new Backbone.Collection()
        });

        that.productChildView =  Mn.CollectionView.extend({
          tagName: 'ul',
          className: 'prod-group',
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
      setActiveMenuItem: function(e){
        e.stopPropagation();
        var $el = $(this.el);
        $el.addClass('active').siblings().removeClass('active').children('.menu-group__item').removeClass('active');
        $el.siblings().find('.menu-group__item').removeClass('active');

        if($el.children('.childrenBlock').children('.prod-group').length) this.showProds();
        else this.showSubMenuGroup();
      },
      showProds: function(){
        $(this.el).children('.childrenBlock').children('.prod-group').slideDown(300);
      },
      showSubMenuGroup: function(){
        var $el = $(this.el);
        $el.children('.childrenBlock').children('.menu-group').addClass('menu-group--current').slideDown(300);
        $el.siblings().find('.menu-group').hide();
        $el.siblings().find('.prod-group').hide();
        $el.siblings().find('.panel').hide();
        $el.parents('.menu-group').removeClass('menu-group--current');
      },
      regions: {
        childrenRegion: '.childrenBlock'
      }
    });
    return GroupListItemView;
  });