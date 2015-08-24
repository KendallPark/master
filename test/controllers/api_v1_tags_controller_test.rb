require 'test_helper'

class Api::V1::TagsControllerTest < ControllerTestCase
  context "#index" do
    should "return a list of tags" do
      get :index
      assert_equal TagPresenter.present(@user.tags).to_json, response.body
    end
  end
end
