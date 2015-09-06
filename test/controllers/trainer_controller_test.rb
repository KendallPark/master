require 'test_helper'

class TrainerControllerTest < ControllerTestCase
  context "#index" do
    should "return a random next card" do
      get :index
      assert_equal 4, assigns(:cards).count
    end

    should "return a random next card of a certain tag" do
      @card = cards(:one)
      @card.tag_list = ["test"]
      @card.save!

      get :index, tags: "test"
      assert_equal 1, assigns(:cards).count
    end
  end

  context "#score" do
    setup do
      @card = cards(:one)
      @trainer_params = {score: 5}
    end

    should "score the previous card" do
      old_quality = @card.quality_of_last_recall
      patch :score, card_id: @card.id, trainer: @trainer_params
      @card.reload
      assert_not_equal old_quality, @card.quality_of_last_recall
      assert_equal 5, @card.quality_of_last_recall
    end

    should "return the next card as json" do
      patch :score, card_id: @card.id, trainer: @trainer_params
      assert !assigns(:card).nil?
      # assert_equal CardPresenter.present(Card.find(JSON.parse(response.body)["next_card"]["id"])).to_json, response.body
    end

    should "return the next card as json with correct tagging" do
      @card_2 = cards(:two)
      @card_2.tag_list = ["test"]
      @card_2.save!
      patch :score, card_id: @card.id, trainer: @trainer_params, tags: "test"
      assert "test", assigns(:card).tags.first
      assert 1, assigns(:card).tags.count
    end
  end
end
