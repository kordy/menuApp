define([
    "text!templates/productsBlock/excelUploadTemplate.js",
    "api",
    "sync"
  ],
  function (ExcelUploadTemplate, Api, Sync) {
    var ExcelUploadView = Marionette.LayoutView.extend({
      className: 'highlight',
      template: ExcelUploadTemplate,
      initialize: function () {
        this.render();
      },
      uploadingFiles: 0,
      ui: {
        uploadInput: '.excelUpload',
        uploadButton: '.excelAdd'
      },
      showLoader: function () {
        var that = this;
        that.uploadingFiles++;
        that.ui.uploadButton.addClass('loading');
      },
      hideLoader: function () {
        var that = this;
        that.uploadingFiles--;
        if (!that.uploadingFiles) {
          that.ui.uploadButton.removeClass('loading');
        }
      },
      onRender: function (){
        var that = this;

        that.ui.uploadInput.fileupload({
          url: Api.getBasePath() + 'products',
          sequentialUpload: false,
          dataType: 'json',
          add: function (e, data) {
            that.showLoader();
            var jqXHR = data.submit()
              .success(function (result, textStatus, jqXHR) {
                that.hideLoader();
                console.log(result);
                Sync.trigger('updateProducts', result);
                alertify.success('Продукты обновлены');
              })
              .error(function (jqXHR, textStatus, errorThrown) {
                alertify.error('Произошла ошибка при обновлении');
              })
              .complete(function (result, textStatus, jqXHR) {/* ... */});
          }
        });
      }
    });
    return ExcelUploadView;
  });
