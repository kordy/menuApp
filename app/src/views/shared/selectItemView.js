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
      bindings: {
        ':el' : 'name'
      },
      initialize: function() {
        this.model.on('setSelected', this.setSelected, this);
      },
      optionChangedHandler: function() {
        this.model.trigger('selected', this.model);
      },
      setSelected: function() {
        this.$el.prop('selected', true);
        this.optionChangedHandler();
      },
      onRender: function() {
        this.stickit();
      }
    });
    return SelectItemView;
  });