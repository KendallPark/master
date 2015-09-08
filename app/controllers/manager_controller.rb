class ManagerController < ApplicationController
  def index
    if params[:username] != current_user.username
      @browse_only = true
      user = User.find_by({email_prefix: params[:username]})
    else
      @browse_only = false
      user = current_user
    end
    @cards = CardPresenter.present(user.cards.recent, {user: current_user})
  end
end
