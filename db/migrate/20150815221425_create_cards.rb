class CreateCards < ActiveRecord::Migration
  def change
    create_table :cards do |t|
      t.integer :user_id, null: false
      t.integer :card_content_id, null: false
      t.decimal :easiness_factor, default: 2.5
      t.integer :number_repetitions, default: 0, null: false
      t.integer :quality_of_last_recall
      t.date :next_repetition, null: false
      t.timestamps null: false
    end
  end
end
