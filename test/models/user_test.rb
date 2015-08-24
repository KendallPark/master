require 'test_helper'

class UserTest < ActiveSupport::TestCase
  setup do
    @user = users(:kendall)
    @card_one = cards(:one)
    @card_two = cards(:two)
    @card_one.tag_list = ["hey", "yo"]
    @card_one.save!
    @card_two.tag_list = ["hey", "there"]
    @card_two.save!
  end

  context "#next_card" do
    should "get the next card" do
      next_card = @user.next_card
      assert_not_nil next_card
    end
  end

  context "#next_cards" do
    should "get the next card" do
      next_cards = @user.next_cards
      assert_equal 4, next_cards.length
    end
  end

  context "#cards_tagged_with" do
    should "return a list of cards that have a tag name" do
      assert_equal 2, @user.cards_tagged_with("hey").count
      assert_equal 1, @user.cards_tagged_with("yo").count
    end
  end

  context "#cards" do
    should "have tags through their cards" do
      assert_equal 3, @user.tags.count
    end

    should "have tags through cards in order of most to least" do
      assert_equal 2, @user.tags.first.taggings_count
    end
  end
end
