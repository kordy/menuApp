define([
    "text!templates/menuBlockTemplate.js",
    "views/shared/selectView",
    "views/menuBlock/menuProductsView",
    "collections/blanksCollection",
    "collections/menusCollection",
    "collections/hotsCollection",
    "models/menuModel",
    "models/hotModel",
    "models/model",
    "sync",
    "api"
  ],
  function(MenuBlockTemplate, SelectView, MenuProductsView, BlanksCollection, MenusCollection, HotsCollection, MenuModel, HotModel, Model, Sync, Api) {
    var MenuBlockView = Marionette.LayoutView.extend({
      template: MenuBlockTemplate,
      model: new MenuModel(),
      regions: {
        savedMenusRegion: '[data-region="savedMenusRegion"]',
        blankSelectRegion: '[data-region="blankSelectRegion"]',
        menuProductsRegion: '[data-region="menuProductsRegion"]',
        previewRegion: '[data-region="previewRegion"]'
      },
      events: {
        'click .saveButton': 'saveMenu',
        'click .deleteButton': 'deleteMenu',
        'click .previewButton': 'showPDF',
        'click .exportButton': 'exportPDF',
        'click .exportExcelButton': 'exportExcel',
        'click .exportWordButton': 'exportWord',
        'keydown .paddingLeft': 'upDownValue',
        'keydown .paddingRight': 'upDownValue',
        'keydown .paddingTop': 'upDownValue',
        'keydown .paddingBottom': 'upDownValue'
      },
      bindings: {
        '.saveButton, .exportExcelButton, .exportWordButton, .exportButton, .previewButton, .addOptions, .optionsMenu': {
          visible: true,
          observe: 'noItems',
          onGet: function(value) {
            return !value;
          }
        },
        '.exportButton': {
          visible: true,
          observe: 'image',
          onGet: function(value) {
            return value && value._id;
          }
        },
        '.menuName': {
          observe: 'name'
        },
        '.menuEngName': {
          observe: 'nameEng'
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
        '.isTwoColumns': {
          observe: 'isTwoColumns'
        },
        '.paddingLeft': {
          observe: 'paddingLeft'
        },
        '.paddingRight': {
          observe: 'paddingRight'
        },
        '.paddingTop': {
          observe: 'paddingTop'
        },
        '.paddingBottom': {
          observe: 'paddingBottom'
        },
        '.previewRegionW': {
          observe: ['items', 'image'],
          visible: true,
          onGet: function(values) {
            return values[0] && values[0].length && values[1] && values[1]._id;
          }
        },
        '.deleteButton': {
          observe: '_id',
          visible: true
        }
      },
      currentMenuId: null,
      initialize: function() {
        var that = this;

        that.hotsCollection = new HotsCollection();
        that.hotsCollection.fetch();
        that.model.set('hots', that.hotsCollection.toJSON());

        that.blanksCollection = new BlanksCollection();
        Sync.on('blanksUpdate', that.blanksUpdate, that);
        that.menusCollection = new MenusCollection();
        that.menusCollection.fetch();
        that.menusCollection.on('sync', function() {
          that.menusCollection.unshift({'name': '--- Новое меню ---'});
          if (!that.currentMenuId) that.setCurrentMenu(that.menusCollection.first());
          else {
            that.setCurrentMenu(that.menusCollection.find({_id: that.currentMenuId}));
            that.selectMenuView.setSelected(that.currentMenuId);
          }
        });

        that.model.on('change', function() {
          if (that.model.get('image') && that.model.get('image')._id) {
            that.blanksSelectView.setSelected(that.model.get('image')._id);
          } else {
            that.blanksSelectView.setSelected();
          }
        });

        that.model.on('change:isEnglish', function() {
          Sync.trigger('changeLanguage', that.model.get('isEnglish'));
        });

        that.model.on('change:noPrices', function() {
          Sync.trigger('changeNoPrices', that.model.get('noPrices'));
        });

        that.modelItems = new Backbone.Collection();
        that.modelItems.on('add remove sort', function() {
          that.itemsCheck();
          that.model.set('items', that.modelItems.toJSON());
        });

        Api.get('pdfTemplate').done(function(pdfTemplate) {
          that.pdfPreview(pdfTemplate);
        });

        that.model.on('change:isTwoColumns', function() {
          var delimiter = that.modelItems.find({'isDelimiter': true});

          if (that.model.get('isTwoColumns')) {
            if (!delimiter) {
              that.modelItems.unshift({
                isDelimiter: true,
                isDisabled: true,
                name: 'Левая колонка',
                nameEng: 'Левая колонка'
              });
              that.modelItems.push({
                isDelimiter: true,
                name: 'Правая колонка',
                nameEng: 'Правая колонка'
              });
            }
          } else {
            var delimiters = that.modelItems.where({'isDelimiter': true});
            _.each(delimiters, function(item){
              that.modelItems.remove(item);
            });
          }
        });

        Sync.on('addToMenu', that.addProduct, that);

        $(window).on('resize', function() {
          that.setPreviewSize();
        });
      },

      blanksUpdate: function(blanksCollection) {
        var that = this;
        that.blanksCollection.reset(blanksCollection.models);
        that.blanksCollection.unshift({'name': '--- Выберите бланк ---'});
        if (that.model.get('image') && that.model.get('image')._id) {
          that.blanksSelectView.setSelected(that.model.get('image')._id);
        } else {
          that.blanksSelectView.setSelected();
        }
      },

      upDownValue: function(e) {
        var target = $(e.currentTarget);
        var isShift = !! e.shiftKey;
        var val = parseInt(target.val());
        if (e.keyCode == 37 || e.keyCode == 40) {
          if (isShift) val -= 10;
          else val--;
        } else
        if (e.keyCode == 38 || e.keyCode == 39) {
          if (isShift) val += 10;
          else val++;
        }
        if (val < 0) val = 0;
        target.val(val);
        target.change();
      },

      setPreviewSize: function() {
        var that = this;
        var columnWidth = that.$el.find('.optionsMenu').width();
        var previewWidth = that.$el.find('.menu').width();
        var previewHeight = that.$el.find('.menu').height();
        var coef = 1;
        if (previewWidth > columnWidth) {
          coef = columnWidth/previewWidth;
        }
        that.$el.find('.previewRegion').css({
          'transform': 'scale(' + coef + ')',
          '-webkit-transform': 'scale(' + coef + ')',
          'transform-origin': 'top left',
          '-webkit-transform-origin': 'top left'
        });
        that.$el.find('.previewRegionW').css({
          'height': previewHeight * coef + 'px'
        })
      },

      pdfPreview: function(pdfTemplate) {
        var parentView = this;
        var PdfPreView = Marionette.ItemView.extend({
          template: pdfTemplate,
          model: parentView.model,
          initialize: function() {
            this.render();
            this.model.on('change', this.render, this);
          },
          onRender: function() {
            parentView.setPreviewSize();
            this.stickit();
          }
        });
        parentView.pdfPreview = new PdfPreView();
        parentView.previewRegion.show(parentView.pdfPreview);
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
      saveMenuChanges: function() {
        var that = this;
        that.model.set('items', that.modelItems.toJSON());
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
        Sync.trigger('changeLanguage', that.model.get('isEnglish'));
        Sync.trigger('changeNoPrices', that.model.get('noPrices'));
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
        that.model.set('items', that.modelItems.toJSON());
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
          }, that.model.get('name') !== '--- Новое меню ---' ? that.model.get('name') : ''
        )
      },
      showPDF: function() {
        var that = this;
        that.model.set('items', that.modelItems.toJSON());
        that.model.set('hots', that.hotsCollection.toJSON());
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
        that.model.set('items', that.modelItems.toJSON());
        that.model.set('hots', that.hotsCollection.toJSON());
        Api.post('exportPDF', that.model.toJSON()).done(function(fileURL){
          window.location.href = fileURL;
          //Api.get(fileURL);
        });
      },
      exportExcel: function() {
        var that = this;
        that.model.set('items', that.modelItems.toJSON());
        Api.post('exportExcel', that.model.toJSON()).done(function(fileURL){
          window.location.href = fileURL;
          //Api.get(fileURL);
        });
      },
      exportWord: function() {
        var that = this;
        that.model.set('items', that.modelItems.toJSON());
        Api.post('exportWord', that.model.toJSON()).done(function(fileURL){
          window.location.href = fileURL;
          //Api.get(fileURL);
        });
      }
    });
    return MenuBlockView;
  });