require 'sinatra'
require 'sinatra/reloader' if development?
require 'erb'
require 'json'

get "/" do
  @messages = get_messages
  erb :index
end

get '/msg' do
  content_type :json
  get_messages.to_json
end

get '/msg/:id' do
  id = params[:id].to_i
  @messages = get_messages
  msg = @messages[id]
  content_type :json
  msg.to_json
end

post '/msg' do
  @messages = get_messages

  msg_data = JSON.parse(request.body.read.to_s)
  msg = {
    text: msg_data["message"]
  }

  id = @messages.keys.max + 1
  msg[:id] = id
  @messages[id] = msg

  content_type :json
  msg.to_json
end

put "/msg/:id" do
  id = params[:id].to_i
  @messages = get_messages

  msg_data = JSON.parse(request.body.read.to_s)
  msg = @messages[id]
  msg[:text] = msg_data["message"]

  content_type :json
  msg.to_json
end

delete "/msg/:id" do
  id = params[:id].to_i

  @messages = get_messages
  @messages.delete(id)

  content_type :json
  {}.to_json
end

def get_messages
  return settings.messages if settings.respond_to?(:messages)

  messages = {};
  messages[0] = {
    id: 0,
    text: "I'm a message!"
  }
  messages[1] = {
    id: 1,
    text: "I'm a another message!"
  }
  messages[2] = {
    id: 2,
    text: "Yet again, a message."
  }
  messages[3] = {
    id: 3,
    text: "I think you get the idea..."
  }

  set :messages, messages
  return messages
end

