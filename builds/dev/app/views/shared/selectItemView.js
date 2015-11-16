define([
    "text!templates/shared/selectItemTemplate.js"
  ],
  function (SelectItemTemplate) {
    var SelectItemView = Mn.ItemView.extend({
      template: SelectItemTemplate,
      tagName: 'option',
      events : {
        'option_changed' : 'optionChangedHandler'
      },
      optionChangedHandler: function() {
        this.model.trigger('selected', this.model);
      }
    });
    return SelectItemView;
  });