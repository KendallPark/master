class CardPresenter < BasePresenter
  def present(card, options={})
    copied = {}
    copied[:copied] = card.remixed_by?(options[:user]) if options[:user]
    { id: card.id,
      owner_name: card.user.full_name,
      owner_username: card.user.username,
      user_id: card.user.id,
      content_id: card.card_content_id,
      content_user_id: card.content.user.id,
      front: card.content.front,
      back: card.content.back,
      easiness_factor: card.easiness_factor,
      number_repetitions: card.number_repetitions,
      quality_of_last_recall: card.quality_of_last_recall,
      tags: card.tag_list,
      front_image_thumb_url: card.content.front_image.present? ? card.content.front_image.url(:thumb) : nil,
      back_image_thumb_url: card.content.back_image.present? ? card.content.back_image.url(:thumb) : nil,
      front_image_url: card.content.front_image.present? ? card.content.front_image.url(:medium) : nil,
      back_image_url: card.content.back_image.present? ? card.content.back_image.url(:medium) : nil,
    }.merge(copied)
  end
end
