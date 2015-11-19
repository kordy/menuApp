define([
    "text!templates/menuBlock/menuProductsItemTemplate.js"
  ],
  function (MenuProductsItemTemplate) {
    var MenuProductsItemView = Mn.ItemView.extend({
      className: 'menu-list__item',
      tagName: 'li',
      template: MenuProductsItemTemplate,
      initialize: function () {
        //console.log(this);
        //var that = this;
        //that.model.set('nameDefault', that.model.get('name'));
      },
      bindings: {
        '.itemName': 'name',
        '.itemPrice': 'price',
        '.itemMeasure': 'measure'
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
        //var that = this;
        //this.$el = this.$el.children();
        //that.$el.unwrap();
        this.stickit();
      }
    });
    return MenuProductsItemView;
  });
