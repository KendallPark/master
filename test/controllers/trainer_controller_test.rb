require 'test_helper'

class TrainerControllerTest < ControllerTestCase
  context "#index" do
    should "return a random next card" do
      get :index
      assert !assigns(:card).nil?
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
      assert_equal CardPresenter.present(Card.find(JSON.parse(response.body)["id"])).to_json, response.body
    end
  end
end
