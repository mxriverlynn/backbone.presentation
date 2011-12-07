Message = Backbone.Model.extend({
  urlRoot: "/msg"
});

Messages = Backbone.Collection.extend({
  model: Message
});

MessageListView = Backbone.View.extend({
  initialize: function(){
    this.collection.bind("add", this.messageAdded, this);
  },

  messageAdded: function(message){
    var html ="<li>" + message.id + ": " + message.get("message");
    $(this.el).append(html);
  }
});

MessageForm = Backbone.View.extend({
  events: {
    "click #sayit": "clicked"
  },

  initialize: function(){
    _.bindAll(this, "saveSuccess");
  },

  clicked: function(e){
    e.preventDefault();
    var val = $("#message").val();
    var model = new Message();
    model.set({message: val});
    model.save(null, {
      success: this.saveSuccess
    });
  },

  saveSuccess: function(message, response){
    this.collection.add(message);
  }
});

$(function(){
  var messages = new Messages();
  new MessageForm({
    el: $("#message-form"),
    collection: messages
  });

  new MessageListView({
    el: $("#message-list ul"),
    collection: messages
  });
});
