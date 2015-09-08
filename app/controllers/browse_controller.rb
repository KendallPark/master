class BrowseController < ApplicationController
  def index
    @cards = CardPresenter.present(Card.all.recent.where.not(user_id: current_user.id).where('cards.original_content_id = cards.card_content_id'), {user: current_user})
  end
end
