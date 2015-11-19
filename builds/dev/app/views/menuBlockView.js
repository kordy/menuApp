define([
    "text!templates/menuBlockTemplate.js",
    "views/shared/selectView",
    "views/menuBlock/menuProductsView",
    "collections/blanksCollection",
    "collections/menusCollection",
    "models/menuModel",
    "models/model",
    "sync"
  ],
  function(MenuBlockTemplate, SelectView, MenuProductsView, BlanksCollection, MenusCollection, MenuModel, Model, Sync) {
    var MenuBlockView = Marionette.LayoutView.extend({
      template: MenuBlockTemplate,
      model: new MenuModel(),
      regions: {
        savedMenusRegion: '[data-region="savedMenusRegion"]',
        blankSelectRegion: '[data-region="blankSelectRegion"]',
        menuProductsRegion: '[data-region="menuProductsRegion"]'
      },
      events: {
        'change .isEnglish': 'initChangeLanguage',
        'click .saveButton': 'saveMenu',
        'click .deleteButton': 'deleteMenu'
      },
      bindings: {
        '.noAdditionalExpenses': {
          observe: 'noAdditionalExpenses'
        },
        '.serviceIncrease': {
          observe: 'serviceIncrease'
        },
        '.commentAdditionalExpenses': {
          observe: 'commentAdditionalExpenses'
        },
        '.isEnglish': {
          observe: 'isEnglish'
        },
        '.isImages': {
          observe: 'isImages'
        },
        '.noPrices': {
          observe: 'noPrices'
        },
        '.discount': {
          observe: 'discount'
        },
        '.deleteButton': {
          observe: '_id',
          visible: true
        }
      },
      currentMenuId: null,
      initialize: function() {
        var that = this;
        that.blanksCollection = new BlanksCollection();
        that.menusCollection = new MenusCollection();
        that.menusCollection.fetch();
        that.blanksCollection.fetch();
        that.menusCollection.on('sync', function() {
          that.menusCollection.unshift({'name': '--- Новое меню ---'});

          if (!that.currentMenuId) that.setCurrentMenu(that.menusCollection.first());
          else {
            that.setCurrentMenu(that.menusCollection.find({_id: that.currentMenuId}));
            that.selectMenuView.setSelected(that.currentMenuId);
          }
        });
        that.blanksCollection.on('sync', function() {

        });
        Sync.on('addToMenu', that.addProduct, that);
        that.model.items = new Backbone.Collection();
      },
      onRender: function() {
        var that = this;
        that.selectMenuView = new SelectView({collection: that.menusCollection});
        that.selectMenuView.on('change', function(selected) {
          that.setCurrentMenu(selected);
        });
        this.savedMenusRegion.show(that.selectMenuView);
        var blanksSelectView = new SelectView({collection: that.blanksCollection});
        blanksSelectView.on('change', function(selected) {
          console.log(selected);
        });
        this.blankSelectRegion.show(blanksSelectView);
        this.menuProductsView = new MenuProductsView({collection: that.model.items});
        this.menuProductsRegion.show(this.menuProductsView);
        that.stickit();
      },
      initChangeLanguage: function() {
        var that = this;
        Sync.trigger('changeLanguage', that.model.get('isEnglish'));
      },
      setCurrentMenu: function(selected) {
        console.log(selected);
        var that = this;
        var items = selected.get('items');
        if (items.length === 1 && !items[0]._id) that.model.items.reset();
        else that.model.items.reset(items);
        that.model.set(selected.attributes);
      },
      addProduct: function(item) {
        var that = this;
        if (item.code) item.isGroup = true;
        item.children = null;
        that.model.items.add(new Model(item));
        that.model.set('items', that.model.items.toJSON());

      },
      deleteMenu: function() {
        var that = this;
        var name = that.model.get('name');
        that.model.delete().done(function(response) {
          that.currentMenuId = null;
          that.menusCollection.reset(response.menus);
          that.menusCollection.trigger('sync');
          alertify.log('Меню <strong>' + name + '</strong> удалено');
        });
      },
      saveMenu: function() {
        var that = this;
        alertify.prompt('Введите название меню',
          function(evt, value){
            if (!value) return;
            that.model.set('name', value);
            if (!that.model.get('_id')) {
              that.model.save().done(function(response) {
                that.currentMenuId = response.currentMenuId;
                that.menusCollection.reset(response.menus);
                that.menusCollection.trigger('sync');
                alertify.success('Меню <strong>' + that.model.get('name') + '</strong> сохранено');
              });
            }
            else that.model.update().done(function(response) {
              that.currentMenuId = response.currentMenuId;
              that.menusCollection.reset(response.menus);
              that.menusCollection.trigger('sync');
              alertify.success('Меню <strong>' + that.model.get('name') + '</strong> обновлено');
            });
          }, that.model.get('_id') ? that.model.get('name') : ''
        );
      }
    });
    return MenuBlockView;
  });