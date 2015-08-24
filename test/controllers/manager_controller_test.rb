require 'test_helper'

class ManagerControllerTest < ControllerTestCase
  context "#index" do
    should "set @cards with presented cards" do
      get :index, username: @user
      assert assigns(:cards)
    end
  end
end
