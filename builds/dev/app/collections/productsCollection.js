define(['collections/collection', 'models/cardModel'],
  function(Collection, CardModel) {
    var CardsCollection = Collection.extend({
      url: 'v1/cards',
      model: CardModel
    })
  });