class BrowseController < ApplicationController
  def index
    @cards = CardPresenter.present(Card.all.recent.where.not(user_id: current_user.id), {user: current_user})
  end
end
