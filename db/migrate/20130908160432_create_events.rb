class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.string :description
      t.date :creation_date

      t.timestamps
    end
  end
end
