class FixColumnName < ActiveRecord::Migration
  def change
    rename_column :timelines, :type, :featured_type
  end
end
