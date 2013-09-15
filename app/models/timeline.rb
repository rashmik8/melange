class Timeline < ActiveRecord::Base

  validates :description, :presence => true
  validates :genre, :presence => true
  validates :published, :presence => true
  has_many :events

  belongs_to :user
  attr_accessible :description, :genre, :published
end
