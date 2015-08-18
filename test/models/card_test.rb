require 'test_helper'

class CardTest < ActiveSupport::TestCase
  context "when creating a card" do
    should "create the card" do
      refute cards(:one).nil?
    end
  end
  context "when deleting a card" do
    should "delete the card" do
      card = cards(:only_one_card)
      assert Card.exists?(card.id), "should find the card"
      card.destroy
      refute Card.exists?(card.id)
    end

    should "delete a card's associated content" do
      card = cards(:only_one_card)
      content = card.content
      assert CardContent.exists?(content.id), "should find the content"
      card.destroy
      refute CardContent.exists?(content.id), "should also delete card content"
    end

    should "not delete another card's content" do
      card = cards(:two)
      content = card.content
      assert CardContent.exists?(content.id), "should find the content"
      card.destroy
      assert CardContent.exists?(content.id), "should also delete card content"
    end

    should "not delete card content that is being used by another user" do
      card = cards(:one)
      content = card.content
      assert CardContent.exists?(content.id), "should find the content"
      card.destroy
      assert CardContent.exists?(content.id), "should also delete card content"
    end
  end
end
