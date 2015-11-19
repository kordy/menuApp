Mn.View.prototype.getTemplate = function () {
  return _.template(this.getOption('template'));
};

Mn.Behaviors.behaviorsLookup = null;

requirejs.config({
  baseUrl: 'static',
  paths: {
    text: 'js/libs/text',
    api: 'services/api',
    sync: 'services/sync'
  }
});

requirejs(["views/layoutView"], function (LayoutView) {
  var layoutView = new LayoutView();
});