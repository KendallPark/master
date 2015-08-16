require 'test_helper'

class Api::V1::CardsControllerTest < ControllerTestCase
  should "get an index" do
    get :index
    assert_equal @user.cards.to_json, response.body
  end
end
