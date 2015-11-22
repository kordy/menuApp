define([
    "text!templates/menuBlockTemplate.js",
    "views/shared/selectView",
    "views/menuBlock/menuProductsView",
    "collections/blanksCollection",
    "collections/menusCollection",
    "models/menuModel",
    "models/model",
    "sync",
    "api"
  ],
  function(MenuBlockTemplate, SelectView, MenuProductsView, BlanksCollection, MenusCollection, MenuModel, Model, Sync, Api) {
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
        'click .deleteButton': 'deleteMenu',
        'click .previewButton': 'showPDF',
        'click .exportButton': 'exportPDF'
      },
      bindings: {
        '.saveButton, .exportButton, .previewButton, .addOptions, .optionsMenu': {
          visible: true,
          observe: 'noItems',
          onGet: function(value) {
            return !value;
          }
        },
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
            console.log(that.currentMenuId);
            that.setCurrentMenu(that.menusCollection.find({_id: that.currentMenuId}));
            that.selectMenuView.setSelected(that.currentMenuId);
          }
        });
        that.blanksCollection.on('sync', function() {
          that.blanksCollection.unshift({'name': '--- Выберите бланк ---'});
          if (that.model.get('image') && that.model.get('image')._id) {
            that.selectMenuView.setSelected(that.model.get('image')._id);
          } else {
            that.selectMenuView.setSelected();
          }
        });
        that.model.on('change', function() {
          if (that.model.get('image') && that.model.get('image')._id) {
            that.blanksSelectView.setSelected(that.model.get('image')._id);
          } else {
            that.blanksSelectView.setSelected();
          }
          that.modelItems.on('add remove sort', function() {
            that.itemsCheck();
            that.model.set('items', that.modelItems.toJSON());
          })
        });
        Sync.on('addToMenu', that.addProduct, that);
        that.modelItems = new Backbone.Collection();
      },
      itemsCheck: function() {
       var that = this;
        if (that.modelItems.length) {
          that.model.set('noItems', false);
        } else {
          that.model.set('noItems', true);
        }
      },
      onRender: function() {
        var that = this;
        that.selectMenuView = new SelectView({collection: that.menusCollection});
        that.selectMenuView.on('change', function(selected) {
          that.saveMenuChanges();
          that.setCurrentMenu(selected);
        });
        that.savedMenusRegion.show(that.selectMenuView);
        that.blanksSelectView = new SelectView({collection: that.blanksCollection});
        that.blanksSelectView.on('change', function(selected) {
          that.model.set('image', selected.attributes);
        });
        that.blankSelectRegion.show(that.blanksSelectView);
        that.menuProductsView = new MenuProductsView({collection: that.modelItems});
        that.menuProductsRegion.show(that.menuProductsView);
        that.stickit();
      },
      initChangeLanguage: function() {
        var that = this;
        Sync.trigger('changeLanguage', !that.model.get('isEnglish'));
      },
      saveMenuChanges: function() {
        var that = this;
        var prevSelected = that.menusCollection.find({_id: that.model.get('_id')});
        prevSelected.set(that.model.attributes);
      },
      setCurrentMenu: function(selected) {
        var that = this;
        var items = selected.get('items');
        if (items.length === 1 && !items[0]._id) that.modelItems.reset();
        else that.modelItems.reset(items);
        that.modelItems.trigger('change');
        that.model.set(selected.attributes);
        that.itemsCheck();
      },
      addProduct: function(item) {
        var that = this;
        if (item.code) item.isGroup = true;
        item.children = null;
        that.modelItems.add(new Model(item));
      },
      deleteMenu: function() {
        var that = this;
        var name = that.model.get('name');
        that.model.delete().done(function(response) {
          that.currentMenuId = null;
          that.menusCollection.remove(that.model);
          that.setCurrentMenu(that.menusCollection.first());
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
                that.model.set('_id', that.currentMenuId);
                var saved = that.menusCollection.first();
                saved.set(that.model.attributes);
                that.saveMenuChanges();
                that.menusCollection.trigger('sync');
                alertify.success('Меню <strong>' + that.model.get('name') + '</strong> сохранено');
              });
            }
            else that.model.update().done(function(response) {
              that.currentMenuId = response.currentMenuId;
              that.saveMenuChanges();
              alertify.success('Меню <strong>' + that.model.get('name') + '</strong> обновлено');
            });
          }, that.model.get('_id') ? that.model.get('name') : ''
        )
      },
      showPDF: function() {
        var that = this;
        console.log(that);
        Api.post('pdf', that.model.toJSON()).done(function(file){
          var iframe = document.createElement('iframe');
          document.getElementById('pdfContainer').innerHTML = '';
          document.getElementById('pdfContainer').appendChild(iframe);
          iframe.contentWindow.document.write(file);
          console.log($(iframe.contentWindow.document).outerHeight());
          $(iframe).height($(iframe.contentWindow.document).outerHeight());
          $(iframe).width($(iframe.contentWindow.document).outerWidth());
        });
      },
      exportPDF: function() {
        var that = this;
        Api.post('exportPDF', that.model.toJSON()).done(function(fileURL){
          window.location.href = Api.getBasePath() + fileURL;
          Api.get(fileURL);
        });
      }
    });
    return MenuBlockView;
  });