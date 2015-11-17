define([
    "text!templates/menuBlock/menuProductsItemTemplate.js"
  ],
  function (MenuProductsItemTemplate) {
    var MenuProductsItemView = Mn.ItemView.extend({
      className: '',
      tagName: 'tr',
      template: MenuProductsItemTemplate,
      initialize: function () {
        //var that = this;
        //that.model.set('nameDefault', that.model.get('name'));
      },
      events: {
        //'click .removeBlank': 'removeBlank',
        //'click .changeName': 'changeName',
        //'blur .nameInput': 'checkName'
      },
      bindings: {
        //':el': {
        //  classes: {
        //    loading: 'loading'
        //  }
        //},
      },
      onRender: function() {
        var that = this;
        this.$el = this.$el.children();
        that.$el.unwrap();
        //this.stickit();
      }
    });
    return MenuProductsItemView;
  });
