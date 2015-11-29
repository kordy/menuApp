define([
    "text!templates/productsBlock/hotsTableItemTemplate.js",
    "userInfo"
  ],
  function (HotsTableItemTemplate, User) {
    var HotsTableItemView = Mn.ItemView.extend({
      className: '',
      tagName: 'tr',
      template: HotsTableItemTemplate,
      templateHelpers: function(){
        return {
          isAdmin: User.isAdmin()
        }
      },
      initialize: function () {
        var that = this;
        that.model.set('nameDefault', that.model.get('name'));
      },
      events: {
        'click .removeHot': 'removeHot',
        'click .changeName': 'changeName',
        'blur .nameInput': 'checkName'
      },
      bindings: {
        ':el': {
            classes: {
              loading: 'loading'
            }
        },
        '.nameInput': 'name',
        '.changeName': {
          observe: ['name','nameDefault'],
          visible: true,
          onGet: function(values) {
            return (values[0] !== values[1]) && values[0];
          }
        }
      },
      changeName: function() {
        var that = this;
        if (that.model.get('name') === that.model.get('nameDefault') || !that.model.get('name')) return;
        that.model.update().done(function(){
          alertify.success('Акция успешно перименована в <strong>' + that.model.get('name') + '</strong>');
          that.model.set('nameDefault', that.model.get('name'));
        });
      },
      checkName: function() {
        var that = this;
        if (!that.model.get('name')) that.returnName();
      },
      returnName: function() {
        var that = this;
        that.model.set('name', that.model.get('nameDefault'));
      },
      removeHot: function() {
        var that = this;
        that.model.delete().done(function(){
          alertify.log('Файл <strong>' + that.model.get('name') + '</strong> удален');
          that.model.stopListening();
          that.model.trigger('destroy', that.model, that.model.collection);
        });
      },
      onRender: function() {
        this.stickit();
      }
    });
    return HotsTableItemView;
  });
