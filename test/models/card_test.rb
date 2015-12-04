require 'test_helper'

class CardTest < ActiveSupport::TestCase
  context "when creating a card" do
    should "create the card" do
      refute cards(:one).nil?
    end
  end

  context "when retiring a card" do
    setup do
      @retired = cards(:retired)
    end
    should "not display the card in default scope" do
      assert Card.all.find_by(id: @retired.id).nil?
    end
    should "display the card in the unscoped" do
      refute Card.unscoped.all.find_by(id: @retired.id).nil?
    end
    should "retire a card with retire! method" do
      @to_be_retired = cards(:to_be_retired)
      refute @to_be_retired.retired, "card should not be retired"
      assert @to_be_retired.retired_at.nil?, "card should not have a retired_at date"
      @to_be_retired.reload
      @to_be_retired.retire!
      assert @to_be_retired.retired, "card should be retired"
      refute @to_be_retired.retired_at.nil?, "card should have a retired_at date"
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
      card = cards(:only_one_other_card)
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
