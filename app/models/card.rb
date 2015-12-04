class Card < ActiveRecord::Base
  include SuperMemo::SM2
  belongs_to :user
  belongs_to :card_content
  belongs_to :original_content, class_name: "CardContent"
  alias_method :content, :card_content
  default_scope { where(:retired => false) }
  scope :recent, -> { order(:created_at => :desc) }
  validates_presence_of :user, :card_content, :next_repetition, :original_content
  before_validation :set_initial_next_repetition, on: :create
  before_validation :set_original_content, on: :create
  acts_as_ordered_taggable
  after_destroy :cleanup

  def front
    card_content.front
  end

  def back
    card_content.back
  end

  def remixed_by?(the_user)
    card_content.remixed_by?(the_user)
  end

  def retire!
    self.retired = true
    self.retired_at = Time.now
    self.save!
  end

private

  def set_initial_next_repetition
    self.next_repetition = Date.today
  end

  def set_original_content
    self.original_content ||= self.content
  end

  def cleanup
    unless self.content.remixed?
      self.content.destroy
    end
  end

end
