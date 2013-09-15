class AddHeadlineToTimelines < ActiveRecord::Migration
  def change
    add_column :timelines, :headline, :string
  end
end
