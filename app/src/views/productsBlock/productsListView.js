define([
    "text!templates/productsBlock/productsListTemplate.js",
    "views/productsBlock/groupListItemView",
    "views/productsBlock/productsListItemView",
    "collections/groupsCollection",
    "collections/productsCollection",
    "sync"
  ],
  function (ProductsListTemplate, GroupListItemView, ProductsListItemView, GroupsCollection, ProductsCollection, Sync) {

    var ProductsListView = Mn.LayoutView.extend({
      className: 'highlight',
      template: ProductsListTemplate,
      initialize: function() {
        var that = this;

        that.productsCollection = new ProductsCollection();
        that.groupsCollection = new GroupsCollection();
        that.parsedGroupsCollection = new GroupsCollection();

        $.when(that.groupsCollection.fetch(), that.productsCollection.fetch()).then(function() {
          that.formatCollection();
        });
        Sync.on('updateProducts', function(items){
          that.groupsCollection.reset(items.groups);
          that.productsCollection.reset(items.products);
          that.render();
          that.formatCollection();
        });
      },
      formatCollection: function() {
        var that = this;
        var parsedCollection = [];
        that.groupsCollection.each(function(item) {
          if (item.get('code').length === 2) {
            parsedCollection[parsedCollection.length] = item;
          } else {
            that.setToGroupParent(item);
          }
        });
        that.productsCollection.each(function(item) {
          that.setGroupProducts(item);
        });
        that.parsedGroupsCollection.reset(parsedCollection);

        that.groupCollectionView = new Mn.CollectionView({
          tagName: 'ul',
          className: 'nav nav-sidebar sidebar menu-group',
          childView: GroupListItemView,
          collection: that.parsedGroupsCollection
        });
        that.productsListRegion.show(that.groupCollectionView);

        that.notFirst = true;
      },
      setGroupChildren: function(parentItem) {
        var that = this;
        var children;
        var childrenView = 'group';
        children = that.groupsCollection.filter(function(item){
          return item.get('code').substr(0,(item.get('code').length - 2)) === parentItem.get('code');
        });
        if (!children.length)  {
          children = that.productsCollection.filter(function(item){
            var code = item.get('group')[item.get('group').length - 1].code;
            return code === parentItem.get('code');
          });
          childrenView = 'products';
        }
        if (!children) return;
        parentItem.set('children', children);
        parentItem.set('childrenView', childrenView);
      },
      setGroupProducts: function(childItem) {
        var that = this;
        var code = childItem.get('group')[childItem.get('group').length - 1].code;
        var parent = that.groupsCollection.findWhere({code: code});
        if (!parent) return;
        var currentChildren = parent.get('children');
        if (!currentChildren) currentChildren = [];
        currentChildren[currentChildren.length] = childItem;
        parent.set('children', currentChildren);
        parent.set('childrenView', 'product');
      },
      setToGroupParent: function(childItem) {
        var that = this;
        var parentCode = childItem.get('code').substr(0,(childItem.get('code').length - 2));
        var parent = that.groupsCollection.findWhere({code: parentCode});
        if (!parent) return;
        var currentChildren = parent.get('children');
        if (!currentChildren) currentChildren = [];
        currentChildren[currentChildren.length] = childItem;
        parent.set('children', currentChildren);
        parent.set('childrenView', 'group');
      },
      regions: {
        productsListRegion: '[data-region="productsListRegion"]'
      },
      onRender: function() {

      }
    });
    return ProductsListView;
  });