class AddOriginalContentToCards < ActiveRecord::Migration
  def change
    add_column :cards, :original_content_id, :integer, null: false, default: 0

    Card.all.each do |card|
      card.original_content = card.content
      card.save!
    end

    change_column_default :cards, :original_content_id, nil
  end
end
