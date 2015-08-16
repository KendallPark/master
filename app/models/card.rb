class Card < ActiveRecord::Base
  include SuperMemo::SM2
  belongs_to :user
  belongs_to :card_content
  validates_presence_of :user, :card_content, :next_repetition
end
