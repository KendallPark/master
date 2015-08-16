class CreateCardContents < ActiveRecord::Migration
  def change
    create_table :card_contents do |t|
      t.integer :user_id
      t.text :front
      t.text :back
      t.timestamps null: false
    end
  end
end
