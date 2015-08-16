require 'test_helper'

class UserTest < ActiveSupport::TestCase
  setup do
    @user = users(:kendall)
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
      assert_equal 3, next_cards.length
    end
  end
end
