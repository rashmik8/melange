class AddTypeToTimelines < ActiveRecord::Migration
  def change
    add_column :timelines, :type, :string
  end
end
