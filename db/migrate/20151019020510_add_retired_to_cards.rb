class AddRetiredToCards < ActiveRecord::Migration
  def change
    add_column :cards, :retired, :boolean, null: false, default: false
    add_column :cards, :retired_at, :datetime
  end
end
