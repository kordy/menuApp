define(['api'],
  function(Api) {

    var Collection = Backbone.Collection.extend({

      getUrl: function() {
        return _.isFunction(this.url) ? this.url() : this.url;
      },

      save: function() {
        return Api.post(this.getUrl(), this.attributes);
      },

      fetch: function(options) {
        var that = this;
        Api.get(that.getUrl(), options)
          .done(function(data) {
            if (_(that.parse).isFunction()) {
              data = that.parse(data);
            }

            if (options.limit) {
              that.fullLength = data.length;
              data = _.first(data, options.limit);
            }

            var collection = _(data).map(function(attrs) {
              var newModel = new that.model();
              newModel.set(newModel.cook(attrs));

              return newModel;
            });
            that.set(collection);
            that.trigger('sync');
          })
          .fail(function() {
            that.trigger('error');
          });

        return deferredFetch;
      },

      parse: function(data) {
        return data.list;
      }
    });

    return Collection;
  });
