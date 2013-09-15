json.array!(@events) do |event|
  json.extract! event, :description, :creation_date
  json.url event_url(event, format: :json)
end