define(['collections/collection', 'models/menuModel'],
  function(Collection, MenuModel) {
    var MenusCollection = Collection.extend({
      url: 'menus',
      model: MenuModel
    });
    return MenusCollection
  });
