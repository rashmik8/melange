class CreateTimelines < ActiveRecord::Migration
  def change
    create_table :timelines do |t|
      t.string :description
      t.string :published
      t.string :genre

      t.timestamps
    end
  end
end
