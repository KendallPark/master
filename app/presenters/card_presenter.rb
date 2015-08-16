class CardPresenter < BasePresenter
  def present(card)
    { id: card.id,
      user_id: card.user.id,
      content_id: card.card_content_id,
      content_user_id: card.content.user.id,
      front: card.content.front,
      back: card.content.back,
      easiness_factor: card.easiness_factor,
      number_repetitions: card.number_repetitions,
      quality_of_last_recall: card.quality_of_last_recall,
      tags: card.tag_list,
    }
  end
end
