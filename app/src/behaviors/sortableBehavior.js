define(function() {
  var SortableBehavior = Mn.Behavior.extend({
    onRender: function () {
      var that = this;

      that.viewEl = function() {
        if (that.options && that.options.el) return that.view.$el.find(that.options.el);
        else return that.view.$el;
      };

      var collection = this.view.collection // �������� ���������
        , items = this.view.children._views // �������� ������ �������� ���������
        , view;

      collection.on('add remove change sort', function() {
        for (var v in items) {
          view = items[v];
          view.$el.attr('data-backbone-cid', view.model.cid); // ����������� ������� � ������ �� cid
        }
      });
      that.viewEl().sortable({ // ������ ������ �����������
        cancel: this.options.cancel || false,
        axis: this.options.axis || false,
        grid: this.options.grid || false,
        items: this.options.items || false,
        containment: this.options.containment || false,
        cursor: "move",
        handle: this.options.handle || false,
        revert: this.options.revert || false,
        update: function (event, ui) {
          var model = collection.get(ui.item.data('backbone-cid'));
          collection.remove(model, {silent: true});
          collection.add(model, {at: ui.item.index(), silent: true});
          collection.trigger('sort');
        }
      });
    }
  });

  return SortableBehavior;
});