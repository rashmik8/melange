class AddTimelineRefToEvents < ActiveRecord::Migration
  def change
    add_reference :events, :timeline, index: true
  end
end
