class AddUserRefToTimelines < ActiveRecord::Migration
  def change
    add_reference :timelines, :user, index: true
  end
end
