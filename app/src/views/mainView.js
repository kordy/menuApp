define([
    "text!templates/layoutTemplate.js",
    "views/productsBlockView",
    "views/menuBlockView",
    "router",
    "api",
    "userInfo"
],
    function(LayoutTemplate, ProductsBlockView, MenuBlockView, Router, Api, User) {
        var MainView = Marionette.LayoutView.extend({
            el: 'body',
            templateHelpers: function(){
                return {
                    user: User.get().name
                }
            },
            template: LayoutTemplate,
            regions: {
              productsBlockRegion: '#productsBlockRegion',
              menuBlockRegion: '#menuBlockRegion'
            },
            events: {
              'click .logoutButton': 'logout'
            },
            logout: function() {
              Api.post('logout').done(function(){
                  Router.go('login');
              });
            },
            initialize: function() {
                this.render();
            },
            onRender: function() {
                var productsBlockView = new ProductsBlockView();
                this.productsBlockRegion.show(productsBlockView);
                var menuBlockView = new MenuBlockView();
                this.menuBlockRegion.show(menuBlockView);
            }
        });
        return MainView;
    });