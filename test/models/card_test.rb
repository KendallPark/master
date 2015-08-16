require 'test_helper'

class CardTest < ActiveSupport::TestCase
  context "when creating a card" do
    should "create the card" do
      refute cards(:one).nil?
    end
  end
end
