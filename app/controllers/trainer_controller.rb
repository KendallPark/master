class TrainerController < ApplicationController
  def index
    @filter_tags = params[:tags]
    @cards = current_user.next_cards(params.slice(:tags))
    @remaining = @cards.count
    @tags = TagPresenter.present(current_user.tags)
    @card = CardPresenter.present(@cards.order(:updated_at).first(100).sample)
    # @card = CardPresenter.present(@cards.first(30).sample)
  end

  def score
    prev_card = current_user.cards.find(params[:card_id])
    prev_card.process_recall_result(trainer_params[:score].to_i)
    prev_card.save!
    @cards = current_user.next_cards(trainer_params.slice(:tags))
    @card = CardPresenter.present(@cards.order(:updated_at).first(100).sample)
    # @card = CardPresenter.present(@cards.first(30).sample)
    render json: { next_card: @card, remaining: @cards.count }
  end

private

  def trainer_params
    params.require(:trainer).permit(:score, :tags)
  end

end
