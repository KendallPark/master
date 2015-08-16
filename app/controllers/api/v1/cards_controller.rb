class Api::V1::CardsController < Api::V1::BaseController
  def index
    @cards = current_user.cards
    render json: @cards
  end
end
