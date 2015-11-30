define(['collections/collection', 'models/hotModel'],
  function(Collection, HotModel) {
    var HotCollection = Collection.extend({
      url: 'hots',
      model: HotModel
    });
    return HotCollection;
  });
