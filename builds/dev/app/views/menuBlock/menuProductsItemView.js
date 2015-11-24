define([
    "text!templates/menuBlock/menuProductsItemTemplate.js",
    "sync"
],
  function (MenuProductsItemTemplate, Sync) {

    var MenuProductsItemView = Mn.ItemView.extend({
      className: 'menu-list__item',
      tagName: 'li',
      template: MenuProductsItemTemplate,
      initialize: function () {
        var that = this;
        Sync.on('changeLanguage', that.changeLanguage, that);
      },
      events: {
        'click .menuItemDelete': 'deleteItem',
        'keypress .itemName': 'setInpWidth'
      },
      bindings: {
        ':el': {
          classes: {
            'menu-list__item--group': 'isGroup',
            'menu-list__item--disabled': 'isDisabled',
            'menu-list__item--isDelimiter': 'isDelimiter'
          }
        },
        '.itemName':{
          observe: ['name','nameEng','isEnglish'],
          onGet: function(values) {
            return values[2] ? values[1] : values[0];
          },
          onSet: function(value) {
            if (!this.model.get('isEnglish')) {
              this.model.set('name', value);
            } else {
              this.model.set('nameEng', value);
            }
          }
        },
        '.itemMeasure':'serving',
        '.itemPrice':'priceServing',
        '.itemPriceBase':'priceBase'
      },
      changeLanguage: function(isEnglish) {
        var that = this;
        that.model.set('isEnglish', isEnglish);
      },
      onRender: function() {
        this.stickit();
        this.setInpWidth();
      },
      deleteItem: function() {
        var that = this;
        that.model.trigger('removeItem', that.model);
      },
      setInpWidth: function() {
        var $el = this.$el,
            $inp = $el.find('.itemName');
        if(!$el.hasClass('menu-list__item--group')) return;
        $inp.css({'width' : (($inp.val().length + 1) * 8.2) + 'px'});
      }
    });
    return MenuProductsItemView;
  });
