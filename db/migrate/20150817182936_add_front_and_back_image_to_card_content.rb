class AddFrontAndBackImageToCardContent < ActiveRecord::Migration
  def self.up
    add_attachment :card_contents, :front_image
    add_attachment :card_contents, :back_image
  end

  def self.down
    remove_attachment :card_contents, :front_image
    remove_attachment :card_contents, :back_image
  end
end
