Message = Backbone.Model.extend({
  urlRoot: "/msg"
});

MessageCollection = Backbone.Collection.extend({
  url: "/msg"
});

MessageListView = Backbone.View.extend({
  initialize: function(){
    _.bindAll(this, "render", "messageAdded");
    this.collection.bind("reset", this.render, this);
    this.collection.bind("add", this.messageAdded, this);
  },

  render: function(){
    this.collection.each(this.messageAdded);
  },

  messageAdded: function(message){
    var msgView = new MessageView({
      model: message
    });
    msgView.render();
    $(this.el).append(msgView.el);
  }
});

MessageView = Backbone.View.extend({
  tagName: "li",

  events: {
    "click": "clicked"
  },

  clicked: function(){
    this.model.destroy();
    this.remove();
  },

  render: function(){
    $(this.el).append(this.model.id + ": " + this.model.get("message"));
  }
});

SayItForm = Backbone.View.extend({
  id: "add-message",

  events: {
    "click #sayit": "sayItClicked",
    "change #message": "messageSet"
  },

  initialize: function(){
    _.bindAll(this, "saveSuccess");
  },

  messageSet: function(e){
    var message_text = $(e.currentTarget).val();
    this.model.set({
      message: message_text
    });
  },

  sayItClicked: function(e){
    e.preventDefault();
    this.model.save(null, {
      success: this.saveSuccess
    });
  },

  saveSuccess: function(model, response){
    this.collection.add(model);
  },

  render: function(){
    var output = $("#add-message-template").tmpl();
    $(this.el).html(output);
  }
});

$(function(){
  var messages = new MessageCollection();

  var renderAddMessageForm = function(){
    var msg = new Message();
    var sayItForm = new SayItForm({
      model: msg,
      collection: messages
    });
    sayItForm.render();
    $("#content_area").html(sayItForm.el);
  }

  new MessageListView({
    el: $("#message-list ul"),
    collection: messages
  });

  renderAddMessageForm();

  messages.bind("add", function(){
    renderAddMessageForm();
  });

  messages.fetch();
})





