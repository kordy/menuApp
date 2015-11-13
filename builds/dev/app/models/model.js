define(['api'],
  function(Api) {
    var Model = Backbone.Model.extend({
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

      save: function(attrs) {
        options = options || {};
        if (attrs) {
          this.set(attrs);
        }
        return Api.post(this.getUrl(), this.cook(this.attributes, true));
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
          that.set(that.cook(data));
          that.trigger('sync');
        })
          .fail(function() {
            that.trigger('error');
          });
        return request;
      },

      cook: function(sourceAttrs, inverse) {
        var that = this;

        var defToRules = function(defaults) {
          var rules = {};
          var translator = function(defObj, currentPath) {
            _.each(defObj, function(val, key) {
              var dot = currentPath ? '.' : '';
              var subCurrentPath = currentPath + dot + key;
              if (_(val).isObject() && !_(val).isArray()) {
                translator(val, subCurrentPath);
              } else {
                rules[subCurrentPath] = subCurrentPath;
              }
            });
          };
          translator(defaults, '');
          return rules;
        };
        var inverseRules = function(rules) {
          _(rules).map(function(rule) {
            var buf = rule[1];
            rule[1] = rule[0];
            rule[0] = buf;
          });
        };
        var sortThrowRules = function(throwRules) {
          return _(throwRules).sortBy(function(pair) {
            return pair[0].split('.').length;
          });
        };
        var thrower = function(fromPath, toPath, from, to) {
          var wrappedFromObj = _(from).dig(fromPath);
          var fromObj = wrappedFromObj._wrapped;
          if (_(fromObj).isUndefined() || wrappedFromObj._unReach) {
            return;
          }
          toPath = toPath.split('.');

          var currentToObj = to;
          for (var i = 0; i < (toPath.length - 1); i++) {
            if (!_(currentToObj[toPath[i]]).isObject()) {
              currentToObj = currentToObj[toPath[i]] = {};
            } else {
              currentToObj = currentToObj[toPath[i]];
            }
          }

          currentToObj[toPath.pop()] = fromObj;

          return to;
        };

        if (!_(that.defaults).isObject()) {
          return sourceAttrs;
        }
        var renameRules = that.renameRules;
        var throwRules = _.pairs(_.extend(defToRules(that.defaults), renameRules));

        if (inverse) {
          inverseRules(throwRules);
        }

        var sortedThrowRules = sortThrowRules(throwRules);
        var cookedAttrs = {};

        _.each(sortedThrowRules, function(pair) {
          thrower(pair[1], pair[0], sourceAttrs, cookedAttrs);
        });

        return cookedAttrs;
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
