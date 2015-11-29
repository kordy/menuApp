define([
    "text!templates/productsBlock/blanksTableTemplate.js",
    "collections/blanksCollection",
    "views/productsBlock/blanksTableItemView",
    "api",
    "userInfo",
    "sync"
  ],
  function (BlanksTableTemplate, BlanksCollection, BlanksTableItemView, Api, User, Sync) {
    var BlanksTableView = Mn.CompositeView.extend({
      className: 'highlight imageBlock',
      collection: new BlanksCollection(),
      childView: BlanksTableItemView,
      childViewContainer: '#blanksBody',
      template: BlanksTableTemplate,
      templateHelpers: function(){
        return {
          isAdmin: User.isAdmin()
        }
      },
      uploadingFiles: 0,
      ui: {
        uploadInput: '.blankUpload',
        uploadButton: '.imageAdd'
      },
      initialize: function () {
        var that = this;
        that.collection.fetch();
        that.collection.on('sync', function() {
          Sync.trigger('blanksUpdate', that.collection);
          that.collection.on('change', function() {
            Sync.trigger('blanksUpdate', that.collection);
          })
        });

        that.bindUIElements()
      },
      showLoader: function () {
        var that = this;
        that.uploadingFiles++;
        that.ui.uploadButton.addClass('loader');
      },
      hideLoader: function () {
        var that = this;
        that.uploadingFiles--;
        if (!that.uploadingFiles) {
          that.ui.uploadButton.removeClass('loader');
        }
      },
      onRender: function (){
        var that = this;

        var token = $.cookie('token');
        that.ui.uploadInput.fileupload({
          url: Api.getBasePath() + 'image',
          sequentialUpload: false,
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          },
          beforeSend: function(xhr, data) {
            xhr.setRequestHeader('X-Access-Token', token);
          },
          add: function (e, data) {
            that.showLoader();
            var jqXHR = data.submit()
              .success(function (result, textStatus, jqXHR) {
                that.collection.add(result);
                Sync.trigger('blanksUpdate', that.collection);
                that.hideLoader();
                alertify.success('Файл <strong>' + result.name + '</strong> загружен');
              })
              .error(function (jqXHR, textStatus, errorThrown) {/* ... */})
              .complete(function (result, textStatus, jqXHR) {/* ... */});
          }
        });
      }
    });
    return BlanksTableView;
  });