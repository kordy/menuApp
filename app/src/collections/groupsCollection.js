define(['collections/collection', 'models/groupModel'],
  function(Collection, GroupModel) {
    var GroupsCollection = Collection.extend({
      url: 'groups',
      model: GroupModel
    });
    return GroupsCollection
  });
