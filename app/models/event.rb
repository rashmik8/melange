class Event < ActiveRecord::Base

  validates :description, :presence => true
  validates :creation_date, :presence => true

  belongs_to :timeline
  attr_accessible :description, :creation_date
end
