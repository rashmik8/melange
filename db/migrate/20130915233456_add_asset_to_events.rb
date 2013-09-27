class AddAssetToEvents < ActiveRecord::Migration
  def change
    add_column :events, :asset, :Hash
  end
end
