require 'test_helper'

class CardPresenterTest < ActiveSupport::TestCase
  setup do
    @card = cards(:one)
    @presented = CardPresenter.present(@card)
  end

  should "present user_id" do
    assert_equal @card.user_id, @presented[:user_id]
  end
  should "present content_id" do
    assert_equal @card.card_content_id, @presented[:content_id]
  end
  should "present content_user_id" do
    assert_equal @card.content.user_id, @presented[:content_user_id]
  end
  should "present front" do
    assert_equal @card.content.front, @presented[:front]
  end
  should "present back" do
    assert_equal @card.content.back, @presented[:back]
  end
  should "present easiness_factor" do
    assert_equal @card.easiness_factor, @presented[:easiness_factor]
  end
  should "present number_repetitions" do
    assert_equal @card.number_repetitions, @presented[:number_repetitions]
  end
  should "present quality_of_last_recall" do
    assert_equal @card.quality_of_last_recall, @presented[:quality_of_last_recall]
  end

end
