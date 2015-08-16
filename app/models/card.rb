class Card < ActiveRecord::Base
  include SuperMemo::SM2
  belongs_to :user
  belongs_to :card_content
  validates_presence_of :user, :card_content, :next_repetition
  before_validation :set_initial_next_repetition, on: :create
  acts_as_ordered_taggable
  alias_method :content, :card_content

  def front
    card_content.front
  end

  def back
    card_content.back
  end

private

  def set_initial_next_repetition
    self.next_repetition = Date.today
  end

end
