define([
    "text!templates/loginTemplate.js",
    "models/userModel",
    "api",
    "router"
  ],
  function (LoginTemplate, UserModel, Api, Router) {
    var loginView = Marionette.LayoutView.extend({
      el: 'body',
      template: LoginTemplate,
      model: new UserModel(),
      bindings: {
        '.loginInput': {
          observe: 'login'
        },
        '.passwordInput': {
          observe: 'password'
        }
      },
      events: {
        'submit': 'login'
      },
      login: function () {
        if (!this.model.get('login') || !this.model.get('login')) {
          alertify.error('Введите логин и пароль');
          return;
        }
        Api.post(this.model.getUrl(), this.model.toJSON()).done(function(data) {
          if(data && data.success && data.token) {
            $.cookie("token", data.token, {
              path    : '/'
            });
            Router.go('main');
          } else {
            alertify.error('Неверный логин или пароль');
          }
        })
          .fail(function(){
            alertify.error('Неверный логин или пароль');
          })
        ;
        return false;
      },
      initialize: function () {
        this.render();
      },
      onRender: function () {
        this.stickit();
      }
    });
    return loginView;
  });