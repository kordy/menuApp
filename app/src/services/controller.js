define(['views/mainView', 'views/loginView', 'api', 'router' , 'userInfo'], function(MainView, LoginView, Api, Router, User) {
  var Controller = Marionette.Controller.extend({
    initialize: function(options) {
      //TODO: code to initialize
    },
    start: function() {
      //TODO: code to start
    },
    login: function() {

      Api.post('islogin')
        .done(function(data) {
          Router.go('main');
        })
        .fail(function(data) {
        });
      var loginView = new LoginView();
    },
    main: function() {
      console.log('herre');
      Api
        .post('islogin').fail(function() {
          Router.go('login');
      })
        .done(function(data) {
          User.set(data.userInfo);
          var mainView = new MainView();
        });

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