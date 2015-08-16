class AddRepetitionInteveralToCards < ActiveRecord::Migration
  def change
    add_column :cards, :repetition_interval, :integer
    add_column :cards, :last_studied, :date
  end
end
