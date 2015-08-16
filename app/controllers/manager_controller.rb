class ManagerController < ApplicationController
  def index
    @cards = CardPresenter.present(current_user.cards)
  end
end
