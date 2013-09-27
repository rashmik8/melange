class AddHeadlineToEvents < ActiveRecord::Migration
  def change
    add_column :events, :headline, :string
  end
end
