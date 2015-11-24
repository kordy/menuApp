Mn.View.prototype.getTemplate = function () {
  return _.template(this.getOption('template'));
};

Mn.Behaviors.behaviorsLookup = null;

requirejs.config({
  baseUrl: 'static',
  paths: {
    text: 'js/libs/text',
    api: 'services/api',
    sync: 'services/sync',
    router: 'services/router',
    controller: 'services/controller',
    userInfo: 'services/userInfo'
  }
});

requirejs(["router", "controller"], function (AppRouter, AppController) {

  var App = new Marionette.Application();
  var controller = new AppController({});

  App.addInitializer(function(options) {
    var router = new AppRouter({
      controller : controller
    });
  });

  App.on("start", function(){
    Backbone.history.start();
  });

  App.start();

});