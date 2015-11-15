define([
    "views/productsBlock/groupListItemView"
  ],
  function (GroupListItemView) {
    var GroupListView = Marionette.LayoutView.extend({
      tagName: 'ul',
      childView: GroupListItemView,
      initialize: function() {
      }
    });
    return GroupListView;
  });