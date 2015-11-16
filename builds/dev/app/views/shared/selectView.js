define([
    "views/shared/selectItemView"
  ],
  function (SelectItemView) {
    var SelectView = Mn.CollectionView.extend({
      className: 'form-control',
      tagName: 'select',
      childView: SelectItemView,
      events: {
        'change': 'changeSelect'
      },
      changeSelect: function(event, select) {
        this.$("option:selected").trigger('option_changed');
      },
      initialize: function(params) {
        if (params.collection) {
          this.collection = params.collection;
          this.collection.on('selected',this.selectedModel, this);
        }
      },
      selectedModel: function(model){
        this.trigger('change', model);
      }
    });
    return SelectView;
  });