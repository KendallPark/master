class TrainerController < ApplicationController
  def index
    @card = current_user.next_card
  end

  def score
    prev_card = current_user.cards.find(params[:card_id])
    prev_card.process_recall_result(trainer_params[:score].to_i)
    prev_card.save!
    @card = current_user.next_card
    render json: CardPresenter.present(@card)
  end

private

  def trainer_params
    params.require(:trainer).permit(:score)
  end

end
