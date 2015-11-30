define(function() {
  var Router = Marionette.AppRouter.extend({
    appRoutes: {
      'login': 'login',
      'main': 'main',
      '*notFound' : 'notFound'
    }
  });

  Router.go = function(path, options) {
    Backbone.history.navigate(path, {'trigger': true});
  };

  return Router;
});