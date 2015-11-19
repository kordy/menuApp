define(['api'],
  function(Api) {
    var Model = Backbone.Model.extend({
      idAttribute: '_id',
      url: function() {
        var base =
          _.result(this, 'urlRoot') ||
          _.result(this.collection, 'url');
        if (this.isNew()) return base;
        var id = this.get(this.idAttribute);
        return base.replace(/[^\/]$/, '$&/') + encodeURIComponent(id);
      },

      getUrl: function() {
        return _.result(this, 'url');
      },
      getFetchUrl: function() {
        return _.result(this, 'fetchUrl');
      },

      save: function() {
        console.log(this.attributes);
        return Api.post(this.getUrl(), this.attributes);
      },

      delete: function() {
        return Api.delete(this.getUrl());
      },

      update: function() {
        return Api.put(this.getUrl(), this.attributes);
      },

      fetch: function(options) {
        options = options || {};
        var that = this;

        this.trigger('fetch:start');

        var request;

        request = Api.get(that.getFetchUrl());

        request.done(function(data) {
          if (_(that.parse).isFunction()) {
            data = that.parse(data);
          }
          that.set(data);
          that.trigger('sync');
        })
          .fail(function() {
            that.trigger('error');
          });
        return request;
      },

      reset: function() {
        this.set(this.defaults);
      },

      change: function(attributes) {
        var that = this;
        that.clear({silent: true});
        that.set(attributes);
      }
    });

    return Model;
  });
