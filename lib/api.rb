#
# Cited by http://codedecoder.wordpress.com/2013/02/21/sample-rest-api-example-in-rails/
#

require 'net/http'
 
class Api
  attr_accessor :url
  attr_accessor :uri
  
  def initialize
    @url = "http://localhost:3000/timelines"
    @uri = URI.parse @url
  end
  
  # Create an timeline using a predefined XML template as a REST request.
  def create(name="Default Name", published="false", genre="music")
    xml_req =
    "<?xml version='1.0' encoding='UTF-8'?>
    <timeline>
      <published type='string'>#{published}</published>
      <description>#{name}</description>
      <genre>#{genre}</genre>
    </timeline>"
    
    request = Net::HTTP::Post.new(@url)
    request.add_field "Content-Type", "application/xml"
    request.body = xml_req
    
    http = Net::HTTP.new(@uri.host, @uri.port)
    response = http.request(request)
 
    response.body    
  end
  
  # Read can get all timelines with no arguments or
  # get one timeline with one argument.  For example:
  # api = Api.new
  # api.read 2 => one timeline
  # api.read   => all timelines
  def read(id=nil)
    request = Net::HTTP.new(@uri.host, @uri.port)
 
    if id.nil?
      response = request.get("#{@uri.path}.xml")      
    else
      response = request.get("#{@uri.path}/#{id}.xml")    
    end
    
    response.body
  end
  
  # Update an timeline using a predefined XML template as a REST request.
  def update(id, name="Updated Name", published="false", genre="movie")
    xml_req =
    "<?xml version='1.0' encoding='UTF-8'?>
    <timeline>
      <published type='string'>#{published}</published>
      <id type='integer'>#{id}</id>
      <description>#{name}</description>
      <genre>#{genre}</genre>
    </timeline>"
    
    request = Net::HTTP::Put.new("#{@url}/#{id}.xml")
    request.add_field "Content-Type", "application/xml"
    request.body = xml_req
    
    http = Net::HTTP.new(@uri.host, @uri.port)
    response = http.request(request)
    
    # no response body will be returned
    case response
    when Net::HTTPSuccess
      return "#{response.code} OK"
    else
      return "#{response.code} ERROR"
    end
  end
  
  # Delete an timeline with an ID using HTTP Delete
  def delete(id)
    request = Net::HTTP::Delete.new("#{@url}/#{id}.xml")
    http = Net::HTTP.new(@uri.host, @uri.port)
    response = http.request(request)
    
    # no response body will be returned
    case response
    when Net::HTTPSuccess
      return "#{response.code} OK"
    else
      return "#{response.code} ERROR"
    end
  end
    
end
