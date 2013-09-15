class AddStartDateToTimelines < ActiveRecord::Migration
  def change
    add_column :timelines, :startDate, :string
  end
end
