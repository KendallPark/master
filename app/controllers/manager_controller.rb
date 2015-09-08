class ManagerController < ApplicationController
  def index
    @browse_only = params[:username] != current_user.username
    @cards = CardPresenter.present(current_user.cards.recent, {user: current_user})
  end
end
