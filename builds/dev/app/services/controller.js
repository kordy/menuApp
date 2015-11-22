define(['views/mainView', 'views/loginView', 'api', 'router'], function(MainView, LoginView, Api, Router) {
  var Controller = Marionette.Controller.extend({
    initialize: function(options) {
      //TODO: code to initialize
    },
    start: function() {
      //TODO: code to start
    },
    login: function() {
      if ($.cookie('token'))
      Api.post('islogin').done(function() {
        Router.go('main');
      });
      var loginView = new LoginView();
    },
    main: function() {
      Api.post('islogin').fail(function() {
        Router.go('login');
      });
      var mainView = new MainView();
    },
    notFound: function() {
//      var router  =new Router
//      Router.navigate('#tasks/' + this.model.get('id'), {trigger: true})
//      console.log(Router.navigate);
      Router.go('main');
    }
  });
  return Controller;
});