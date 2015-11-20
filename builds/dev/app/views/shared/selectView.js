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
        var that = this;
        if (params.collection) {
          that.collection.on('sync', function() {
//            that.$("option").first().trigger('option_changed');
          });
          that.collection.on('selected',this.selectedModel, this);
        }
      },
      onRender: function() {


      },
      setSelected: function(id) {
        var that = this;
        var selectedModel = that.collection.find({_id: id});
        if (!selectedModel) selectedModel = that.collection.first();
        if (!selectedModel) return;
        selectedModel.trigger('setSelected');
      },
      selectedModel: function(model){
        this.trigger('change', model);
      }
    });
    return SelectView;
  });