class Api::V1::CardsController < Api::V1::BaseController
  def index
    @cards = current_user.cards.recent
    render json: CardPresenter.present(@cards)
  end

  def create
    if card_params[:content_id]
      content = CardContent.find(card_params[:content_id])
    else
      content = current_user.card_contents.create!(card_params.slice(:front, :back, :front_image, :back_image))
    end
    @card = current_user.cards.create!(card_content_id: content[:id], tag_list: card_params[:tag_list])
    render json: CardPresenter.present(@card)
  end

  def blank
    content = current_user.card_contents.create!
    card = current_user.cards.create!(card_content_id: content[:id])
    render json: CardPresenter.present(card)
  end

  def update
    @card = current_user.cards.find(params[:id])
    # important because cards can point to other user's content
    content = current_user.card_contents.find_by_id(@card[:card_content_id])
    if content
      content.update!(card_params.slice(:front, :back, :front_image, :back_image))
    else
      content = current_user.card_contents.create!(card_params.slice(:front, :back))
      @card.assign_attributes(card_content_id: content[:id])
    end
    if card_params[:tag_list]
      @card.tag_list = card_params[:tag_list]
    end
    @card.save!
    render json: CardPresenter.present(@card)
  end

  def destroy
    card = current_user.cards.find(params[:id])
    card.destroy
    render nothing: true, status: :ok
  end

private

  def card_params
    params.require(:card).permit(:front, :back, :content_id, :front_image, :back_image, tag_list: [])
  end

end
