class Api::V1::CardsController < Api::V1::BaseController
  def index
    @cards = current_user.cards.recent
    render json: CardPresenter.present(@cards)
  end

  def create
    tag_list = card_params[:tag_list]
    if card_params[:content_id]
      content = CardContent.find(card_params[:content_id])
      tag_list = content.original_tags unless tag_list
    else
      content = current_user.card_contents.create!(card_params.slice(:front, :back, :front_image, :back_image))
    end
    @card = current_user.cards.create!(card_content_id: content[:id], tag_list: tag_list, original_content_id: content[:id])
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
      content.front_image.destroy if card_params[:delete_front_image]
      content.back_image.destroy if card_params[:delete_back_image]
      content.update!(card_params.slice(:front, :back, :front_image, :back_image))
    else # we're created a duplicate of a cloned card
      original_content = CardContent.find(@card[:card_content_id])
      content = current_user.card_contents.create!(card_params.slice(:front, :back))
      content.front_image = original_content.front_image unless card_params[:delete_front_image]
      content.back_image = original_content.back_image unless card_params[:delete_back_image]
      content.save!
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

  def import
    xml_doc = Nokogiri::XML(import_params[:xml])
    cards = parse_xml(xml_doc.xpath('./opml/body/outline'))
    render json: CardPresenter.present(cards)
  end

private

  def parse_xml(xml, tags=[])
    cards = []
    xml.each do |elem|
      next unless elem.respond_to?(:attributes)
      title = elem.attributes["text"].value.gsub(/^\*+/, "").gsub(/^\!+/, "").strip
      if title.include? "#q"
        title = title.gsub("#q", "").strip
        title = title.split(",").first
        cards.concat parse_questions(elem.xpath("./outline"), tags + [title])
      else
        parse_xml(elem.xpath("./outline"), tags + [title])
      end
    end
    return cards
  end

  def parse_questions(xml, tags)
    cards = []
    # fz = FuzzyMatch.new(current_user.card_contents.select("*"), read: :front)

    xml.each do |elem|
      next unless elem.respond_to?(:attributes)
      question = elem.attributes["text"].value.gsub(/^\*+/, "").gsub(/^\!+/, "").strip
      answer = ""
      answers = elem.xpath("./outline")
      if answers.size == 1
        answer = answers.first.attributes["text"].value
      else
        answer = parse_list(answers)
      end
      question = question
      next if current_user.card_contents.find_by(front: question, back: answer)
      # if existing_content && existing_content.cards.first && existing_content.cards.first.tag_list == tags
      #   existing_content.update!(front: question, back: answer)
      # else
      content = current_user.card_contents.create!(front: question, back: answer)
      card = current_user.cards.create!(card_content_id: content[:id], tag_list: tags, original_content_id: content[:id])
      cards << card
      # end
    end
    return cards
  end

  def parse_list(xml, tab="")
    list = ""
    xml.each do |elem|
      next unless elem.respond_to?(:attributes)
      list << "#{tab}- #{elem.attributes['text'].value}\n"
      list << parse_list(elem.xpath("./outline"), "  ")
    end
    return list
  end

  def card_params
    params.require(:card).permit(:front, :back, :content_id, :front_image, :back_image, :delete_front_image, :delete_back_image, tag_list: [])
  end

  def import_params
    params.require(:import).permit(:xml)
  end

end
