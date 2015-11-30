define(['collections/collection', 'models/blankModel'],
  function(Collection, BlankModel) {
    var BlankCollection = Collection.extend({
      url: 'images',
      model: BlankModel
    });
    return BlankCollection
  });
