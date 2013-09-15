require './lib/api.rb'
require 'nokogiri'
 
# CRUD example with an api
 
def list_timelines(api_object)
  puts "Current Timelines:"
  doc = Nokogiri::XML.parse api_object.read
  names = doc.xpath('timelines/timeline/description').collect {|e| e.text }
  puts names.join(", ")
  puts ""
end
 
api = Api.new
list_timelines(api)
 
# Create
puts "Creating someone..."
api.create "Bobby Flay", "true", "music"
list_timelines(api)
 
# Read one and do nothing with it
api.read 8
 
# Read all and get valid IDs
doc = Nokogiri::XML.parse api.read
ids = doc.xpath('timelines/timeline/id').collect {|e| e.text }
 
# Update last record
puts "Updating last record ..."
api.update ids.last, "Robert Flaid", "false", "movie"
list_timelines(api)
 
# Delete
puts "deleting last record ..."
api.delete ids.last
list_timelines(api)
