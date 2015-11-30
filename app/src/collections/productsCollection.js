define(['collections/collection', 'models/productModel'],
  function(Collection, ProductModel) {
    var ProductsCollection = Collection.extend({
      url: 'products',
      model: ProductModel
    });
    return ProductsCollection
  });