json.array!(@timelines) do |timeline|
  json.extract! timeline, :description, :published, :genre
  json.url timeline_url(timeline, format: :json)
end